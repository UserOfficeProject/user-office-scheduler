import { Grid, IconButton, TableCell, Tooltip } from '@material-ui/core';
import { Check as CheckIcon, Clear as ClearIcon } from '@material-ui/icons';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';

import Loader from 'components/common/Loader';
import Table, { HeadCell } from 'components/common/Table';
import { AppContext } from 'context/AppContext';
import { EquipmentAssignmentStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useEquipmentScheduledEvents from 'hooks/scheduledEvent/useEquipmentScheduledEvents';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';

type TableRow = {
  id: number;
  equipmentName: string;
  instrumentName?: string;
  proposalTitle?: string;
  proposalId?: string;
  startsAt: Moment;
  endsAt: Moment;
  equipmentId?: number | null;
  equipmentAssignmentStatus: EquipmentAssignmentStatus | null;
  scheduledBy: string;
};

export const defaultHeadCells: HeadCell<TableRow>[] = [
  { id: 'equipmentName', label: 'Equipment name' },
  { id: 'instrumentName', label: 'Instrument' },
  { id: 'proposalTitle', label: 'Proposal' },
  { id: 'proposalId', label: 'Proposal ID' },
  { id: 'startsAt', label: 'Starts at' },
  { id: 'endsAt', label: 'Ends at' },
  { id: 'equipmentAssignmentStatus', label: 'Status' },
  { id: 'scheduledBy', label: 'Scheduled by' },
];

export default function ViewRequests() {
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmation } = useContext(AppContext);
  const { loading: scheduledEventsLoading, scheduledEvents } =
    useEquipmentScheduledEvents({
      equipmentIds: [], // NOTE: Empty array is used to load all equipments.
      startsAt: toTzLessDateTime(new Date()),
      endsAt: toTzLessDateTime(moment(new Date()).add(1, 'year')),
      shouldGetAll: true,
    });
  const api = useDataApi();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  useEffect(() => {
    if (!scheduledEventsLoading && scheduledEvents.length) {
      const newRows: TableRow[] = [];

      scheduledEvents.forEach((scheduledEvent) => {
        newRows.push(
          ...scheduledEvent.events.map(
            ({
              startsAt,
              endsAt,
              equipmentAssignmentStatus,
              equipmentId,
              instrument,
              proposalBooking,
              scheduledBy,
              ...rest
            }) => ({
              ...rest,
              equipmentAssignmentStatus,
              startsAt: parseTzLessDateTime(startsAt),
              endsAt: parseTzLessDateTime(endsAt),
              equipmentId: equipmentId,
              equipmentName: scheduledEvent.name,
              instrumentName: instrument?.name,
              proposalTitle: proposalBooking?.proposal?.title,
              proposalId: proposalBooking?.proposal?.proposalId,
              scheduledBy: `${scheduledBy?.firstname} ${scheduledBy?.lastname}`,
            })
          )
        );
      });
      setRows(newRows);
    }
  }, [scheduledEventsLoading, scheduledEvents]);

  if (scheduledEventsLoading) {
    return <Loader container />;
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

        if (!row.equipmentId) {
          setConfirmationLoading(false);

          enqueueSnackbar('No equipment id', {
            variant: 'error',
          });

          return;
        }

        const { confirmEquipmentAssignment: success } =
          await api().confirmEquipmentAssignment({
            confirmEquipmentAssignmentInput: {
              equipmentId: row.equipmentId,
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
        <Tooltip title="Accept request">
          <IconButton
            data-cy="btn-confirm-assignment-accept"
            onClick={() => handleConfirmAssignment(row, 'accept')}
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject request">
          <IconButton
            data-cy="btn-confirm-assignment-reject"
            onClick={() => handleConfirmAssignment(row, 'reject')}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  return (
    <ContentContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            {confirmationLoading && <Loader />}
            {scheduledEventsLoading ? (
              <Loader relative spaced />
            ) : (
              <Table
                defaultOrderBy="startsAt"
                tableTitle="Upcoming requests"
                headCells={defaultHeadCells}
                rowActions={RowActions}
                showEmptyRows
                rows={rows}
                extractKey={(el) => {
                  const key = parseInt(`${el.id}${el.equipmentId}`);

                  return key;
                }}
                renderRow={(row) => {
                  return (
                    <>
                      <TableCell align="left">{row.equipmentName}</TableCell>
                      <TableCell align="left">{row.instrumentName}</TableCell>
                      <TableCell align="left">{row.proposalTitle}</TableCell>
                      <TableCell align="left">{row.proposalId}</TableCell>
                      <TableCell align="left">
                        {toTzLessDateTime(row.startsAt)}
                      </TableCell>
                      <TableCell align="left">
                        {toTzLessDateTime(row.endsAt)}
                      </TableCell>
                      <TableCell align="left">
                        {row.equipmentAssignmentStatus}
                      </TableCell>
                      <TableCell align="left">{row.scheduledBy}</TableCell>
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
