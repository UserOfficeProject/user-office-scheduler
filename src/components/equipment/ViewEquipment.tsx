import MaterialTable, { Column } from '@material-table/core';
import {
  Comment as CommentIcon,
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, generatePath } from 'react-router';
import { Link } from 'react-router-dom';

import ScienceIcon from 'components/common/icons/ScienceIcon';
import Loader from 'components/common/Loader';
import { tableIcons } from 'components/common/TableIcons';
import { PATH_EDIT_EQUIPMENT } from 'components/paths';
import { AppContext } from 'context/AppContext';
import { UserContext } from 'context/UserContext';
import { EquipmentAssignmentStatus, UserRole } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useEquipment from 'hooks/equipment/useEquipment';
import useEquipmentScheduledEvents from 'hooks/scheduledEvent/useEquipmentScheduledEvents';
import { StyledContainer, StyledPaper } from 'styles/StyledComponents';
import { comaSeparatedArrayValues } from 'utils/common';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import {
  isEquipmentOwner,
  isEquipmentResponsiblePerson,
} from 'utils/permissions';
import { getFullUserName } from 'utils/user';

type TableRow = {
  id: number;
  startsAt: Moment;
  endsAt: Moment;
  equipmentAssignmentStatus?: EquipmentAssignmentStatus | null;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    flexGrow: 0,
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  divider: {
    marginLeft: theme.spacing(6),
  },
  flexColumn: {
    flexGrow: 1,
    maxWidth: '100%',
    flexBasis: 0,
    alignSelf: 'flex-start',
  },
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
  listItemText: {
    maxWidth: 'fit-content',
  },
  linkTextDecoration: {
    textDecoration: 'none',
  },
}));

const MaintenanceInfo = ({
  startsAt,
  endsAt,
}: {
  startsAt?: string | null;
  endsAt?: string | null;
}) => {
  if (startsAt && !endsAt) {
    return <>Under maintenance indefinitely</>;
  }

  if (
    startsAt &&
    endsAt &&
    parseTzLessDateTime(endsAt).diff(moment(), 'seconds') >= 0
  ) {
    return (
      <>
        {startsAt} - {endsAt}
      </>
    );
  }

  return <>Has no scheduled maintenance</>;
};

type ViewEquipmentProps = {
  equipmentId: number;
};

// NOTE: Keep columns outside the component to avoid console warning(https://github.com/material-table-core/core/issues/286)
const columns: Column<TableRow>[] = [
  {
    title: 'Starts at',
    render: (rowData) => toTzLessDateTime(rowData.startsAt),
  },
  { title: 'Ends at', render: (rowData) => toTzLessDateTime(rowData.endsAt) },
  { title: 'Status', field: 'equipmentAssignmentStatus' },
];

export default function ViewEquipment({ equipmentId }: ViewEquipmentProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmation } = useContext(AppContext);
  const { user: loggedInUser, currentRole } = useContext(UserContext);
  const { id } = useParams<{ id?: string }>();
  const finalEquipmentId = id ? parseInt(id) : equipmentId;
  const classes = useStyles();
  const { loading: equipmentLoading, equipment } =
    useEquipment(finalEquipmentId);
  const { loading: scheduledEventsLoading, scheduledEvents } =
    useEquipmentScheduledEvents({
      equipmentIds: [finalEquipmentId],
      startsAt: toTzLessDateTime(moment(new Date()).startOf('day')),
      endsAt: toTzLessDateTime(moment(new Date()).add(1, 'year').endOf('day')),
    });
  const api = useDataApi();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const hasEditAccess =
    currentRole === UserRole.USER_OFFICER ||
    isEquipmentResponsiblePerson(equipment, loggedInUser, currentRole) ||
    isEquipmentOwner(equipment, loggedInUser);
  useEffect(() => {
    if (!scheduledEventsLoading && scheduledEvents?.length && equipment) {
      const equipmentWithEvents = scheduledEvents.find(
        (event) => event.id === equipment.id
      );

      if (equipmentWithEvents) {
        setRows(
          equipmentWithEvents.events.map(
            ({ startsAt, endsAt, equipmentAssignmentStatus, ...rest }) => ({
              ...rest,
              equipmentAssignmentStatus,
              startsAt: parseTzLessDateTime(startsAt),
              endsAt: parseTzLessDateTime(endsAt),
            })
          )
        );
      }
    }
  }, [scheduledEventsLoading, scheduledEvents, equipment]);
  if (equipmentLoading) {
    return <Loader container />;
  }

  if (!equipment) {
    return <div>Not found</div>;
  }

  const handleConfirmAssignment = (
    row: TableRow,
    status: 'accept' | 'reject'
  ) => {
    if (!finalEquipmentId) {
      return;
    }

    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>{status}</strong> the request?
        </>
      ),
      cb: async () => {
        setConfirmationLoading(true);

        const newStatus =
          status === 'accept'
            ? EquipmentAssignmentStatus.ACCEPTED
            : EquipmentAssignmentStatus.REJECTED;

        const {
          confirmEquipmentAssignment: { isSuccess },
        } = await api().confirmEquipmentAssignment({
          confirmEquipmentAssignmentInput: {
            equipmentId: finalEquipmentId,
            scheduledEventId: row.id,
            newStatus,
          },
        });

        setConfirmationLoading(false);

        isSuccess &&
          setRows(
            rows.map((item) => ({
              ...item,
              equipmentAssignmentStatus:
                item.id === row.id ? newStatus : item.equipmentAssignmentStatus,
            }))
          );

        isSuccess
          ? enqueueSnackbar('Success', { variant: 'success' })
          : enqueueSnackbar(`Failed to ${status} the assignment`, {
              variant: 'error',
            });
      },
    });
  };

  const pathEquipmentId = id || equipmentId;

  if (!pathEquipmentId) {
    return <div>Equipment ID not found!</div>;
  }

  const CheckIconComponent = (
    props: JSX.IntrinsicAttributes & {
      children?: React.ReactNode;
      'data-cy'?: string;
    }
  ): JSX.Element => <CheckIcon {...props} />;
  const ClearIconComponent = (
    props: JSX.IntrinsicAttributes & {
      children?: React.ReactNode;
      'data-cy'?: string;
    }
  ): JSX.Element => <ClearIcon {...props} />;

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            {confirmationLoading && <Loader />}

            {hasEditAccess && (
              <Box display="flex" justifyContent="flex-end">
                <Link
                  to={generatePath(PATH_EDIT_EQUIPMENT, {
                    id: pathEquipmentId,
                  })}
                  className={classes.linkTextDecoration}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    data-cy="btn-edit-equipment"
                    startIcon={<EditIcon />}
                  >
                    Edit equipment
                  </Button>
                </Link>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item sm={6}>
                <List className={classes.list} dense>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <CommentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Name" secondary={equipment?.name} />
                  </ListItem>
                  <ListItem disableGutters data-cy="equipment-owner">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Owner"
                      secondary={getFullUserName(equipment.owner)}
                      className={classes.listItemText}
                    />
                  </ListItem>
                  <ListItem
                    disableGutters
                    data-cy="equipment-responsible-people"
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <GroupIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Responsible people"
                      secondary={equipment.equipmentResponsible.map(
                        (user, index) =>
                          `${index ? ', ' : ''} ${getFullUserName(user)}`
                      )}
                      className={classes.listItemText}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar
                        data-cy="equipment-color"
                        style={{
                          backgroundColor: equipment.color || '#bdbdbd',
                          border: '1px solid #bdbdbd',
                        }}
                      >
                        <></>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Equipment color"
                      secondary={equipment.color || '-'}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item sm={6}>
                <List className={classes.list} dense>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <CommentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Description"
                      secondary={
                        equipment.description ? equipment.description : '-'
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <ScienceIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Equipment instruments"
                      secondary={comaSeparatedArrayValues(
                        equipment.equipmentInstruments,
                        'name'
                      )}
                      className={classes.listItemText}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <CalendarTodayIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Maintenance"
                      secondary={
                        <MaintenanceInfo
                          startsAt={equipment.maintenanceStartsAt}
                          endsAt={equipment.maintenanceEndsAt}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Auto accept equipment requests"
                      secondary={equipment.autoAccept ? 'Yes' : 'No'}
                      data-cy="autoAccept"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <div data-cy="equipment-upcoming-time-slots-table">
              <MaterialTable
                icons={tableIcons}
                title="Time slots upcoming year"
                columns={columns}
                data={rows}
                options={{ search: false }}
                isLoading={scheduledEventsLoading}
                actions={[
                  (rowData) => ({
                    icon: CheckIconComponent.bind(null, {
                      'data-cy': 'accept-equipment-request',
                    }),
                    tooltip: 'Accept request',
                    hidden:
                      rowData.equipmentAssignmentStatus !==
                      EquipmentAssignmentStatus.PENDING,
                    onClick: () =>
                      handleConfirmAssignment(rowData as TableRow, 'accept'),
                    position: 'row',
                  }),
                  (rowData) => ({
                    icon: ClearIconComponent.bind(null, {
                      'data-cy': 'reject-equipment-request',
                    }),
                    tooltip: 'Reject request',
                    hidden:
                      rowData.equipmentAssignmentStatus !==
                      EquipmentAssignmentStatus.PENDING,
                    onClick: (_event, rowData) =>
                      handleConfirmAssignment(rowData as TableRow, 'reject'),
                    position: 'row',
                  }),
                ]}
              />
            </div>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
