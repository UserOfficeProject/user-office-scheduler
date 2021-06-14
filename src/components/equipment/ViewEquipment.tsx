import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  IconButton,
  Box,
  TableCell,
  Tooltip,
} from '@material-ui/core';
import {
  Comment as CommentIcon,
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
} from '@material-ui/icons';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, generatePath } from 'react-router';
import { Link } from 'react-router-dom';

import Loader from 'components/common/Loader';
import PeopleModal from 'components/common/PeopleModal';
import Table, { HeadCell } from 'components/common/Table';
import { PATH_EDIT_EQUIPMENT } from 'components/paths';
import { AppContext } from 'context/AppContext';
import {
  BasicUserDetails,
  EquipmentAssignmentStatus,
  User,
  UserRole,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useEquipment from 'hooks/equipment/useEquipment';
import useEquipmentScheduledEvents from 'hooks/scheduledEvent/useEquipmentScheduledEvents';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';

type TableRow = {
  id: string;
  startsAt: Moment;
  endsAt: Moment;

  equipmentAssignmentStatus: EquipmentAssignmentStatus | null;
};

export const defaultHeadCells: HeadCell<TableRow>[] = [
  { id: 'startsAt', label: 'Starts at' },
  { id: 'endsAt', label: 'Ends at' },
  { id: 'equipmentAssignmentStatus', label: 'Status' },
];

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
}));

const MaintenanceInfo = ({
  startsAt,
  endsAt,
}: {
  startsAt: string | null;
  endsAt: string | null;
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

export default function ViewEquipment() {
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmation } = useContext(AppContext);
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const { loading: equipmentLoading, equipment } = useEquipment(id);
  const [selectedUsers, setSelectedUsers] = useState<
    Pick<User, 'id' | 'firstname' | 'lastname'>[]
  >([]);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const { loading: scheduledEventsLoading, scheduledEvents } =
    useEquipmentScheduledEvents(
      [parseInt(id)],
      toTzLessDateTime(new Date()),
      toTzLessDateTime(moment(new Date()).add(1, 'year'))
    );
  const equipmentResponsible = equipment?.equipmentResponsible;
  useEffect(() => {
    if (equipmentResponsible) {
      setSelectedUsers(equipmentResponsible);
    }
  }, [equipmentResponsible]);
  const api = useDataApi();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  useEffect(() => {
    if (!scheduledEventsLoading) {
      setRows(
        scheduledEvents[0].events.map(
          ({ startsAt, endsAt, equipmentAssignmentStatus, ...rest }) => ({
            ...rest,
            equipmentAssignmentStatus,
            startsAt: parseTzLessDateTime(startsAt),
            endsAt: parseTzLessDateTime(endsAt),
          })
        )
      );
    }
  }, [scheduledEventsLoading, scheduledEvents]);
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

        const { confirmEquipmentAssignment: success } =
          await api().confirmEquipmentAssignment({
            confirmEquipmentAssignmentInput: {
              equipmentId: id,
              scheduledEventId: row.id,
              newStatus,
            },
          });

        setConfirmationLoading(false);

        success &&
          setRows(
            rows.map(({ ...rest }) => ({
              ...rest,
              equipmentAssignmentStatus:
                rest.id === row.id ? newStatus : rest.equipmentAssignmentStatus,
            }))
          );

        success
          ? enqueueSnackbar('Success', { variant: 'success' })
          : enqueueSnackbar('Failed to confirm the assignment', {
              variant: 'error',
            });
      },
    });
  };

  const RowActions = ({ row }: { row: TableRow }) => {
    if (row.equipmentAssignmentStatus !== EquipmentAssignmentStatus.PENDING) {
      return null;
    }

    return (
      <>
        <IconButton
          data-cy="btn-confirm-assignment-accept"
          onClick={() => handleConfirmAssignment(row, 'accept')}
        >
          <CheckIcon />
        </IconButton>

        <IconButton
          data-cy="btn-confirm-assignment-reject"
          onClick={() => handleConfirmAssignment(row, 'reject')}
        >
          <ClearIcon />
        </IconButton>
      </>
    );
  };

  const addEquipmentResponsibleUsers = async (users: BasicUserDetails[]) => {
    const response = await api().addEquipmentResponsible({
      equipmentResponsibleInput: {
        equipmentId: equipment.id,
        userIds: users.map((user) => user.id),
      },
    });

    if (response.addEquipmentResponsible) {
      enqueueSnackbar('Success', { variant: 'success' });

      setSelectedUsers([...selectedUsers, ...users]);

      setShowPeopleModal(false);
    }
  };

  return (
    <ContentContainer maxWidth={false}>
      <PeopleModal
        show={!!showPeopleModal}
        close={(): void => setShowPeopleModal(false)}
        addParticipants={addEquipmentResponsibleUsers}
        selectedUsers={selectedUsers.map((selectedUser) => selectedUser.id)}
        selection={true}
        title={'Select responsible people'}
        userRole={UserRole.INSTRUMENT_SCIENTIST}
      />
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            {confirmationLoading && <Loader />}

            <Box display="flex" justifyContent="flex-end">
              <Link to={generatePath(PATH_EDIT_EQUIPMENT, { id })}>
                <IconButton data-cy="btn-edit-equipment">
                  <EditIcon />
                </IconButton>
              </Link>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List className={classes.list} dense>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <CommentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Name" secondary={equipment?.name} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Owner"
                      secondary={`${equipment?.owner?.firstname ?? 'Unknown'} ${
                        equipment?.owner?.lastname
                      }`}
                      className={classes.listItemText}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar>
                        <GroupIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Responsible people"
                      secondary={selectedUsers.map(
                        (user, index) =>
                          `${index ? ', ' : ''} ${user.firstname} ${
                            user.lastname
                          }`
                      )}
                      className={classes.listItemText}
                    />
                    <Tooltip title="Add equipment responsible">
                      <IconButton
                        onClick={() => setShowPeopleModal(true)}
                        data-cy="add-equipment-responsible"
                        aria-label="Add equipment responsible"
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List className={classes.list} dense>
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

            {scheduledEventsLoading ? (
              <Loader relative spaced />
            ) : (
              <Table
                defaultOrderBy="startsAt"
                tableTitle="Time Slots Upcoming Year"
                headCells={defaultHeadCells}
                rowActions={RowActions}
                showEmptyRows
                rows={rows}
                extractKey={(el) => el.id}
                renderRow={(row) => {
                  return (
                    <>
                      <TableCell align="left">
                        {toTzLessDateTime(row.startsAt)}
                      </TableCell>
                      <TableCell align="left">
                        {toTzLessDateTime(row.endsAt)}
                      </TableCell>
                      <TableCell align="left">
                        {row.equipmentAssignmentStatus}
                      </TableCell>
                    </>
                  );
                }}
              />
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
