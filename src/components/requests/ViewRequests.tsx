import MaterialTable, { Column } from '@material-table/core';
import { Grid } from '@material-ui/core';
import { Check as CheckIcon, Clear as ClearIcon } from '@material-ui/icons';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';

import Loader from 'components/common/Loader';
import { tableIcons } from 'components/common/TableIcons';
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

export const columns: Column<TableRow>[] = [
  { field: 'equipmentName', title: 'Equipment name' },
  { field: 'instrumentName', title: 'Instrument' },
  { field: 'proposalTitle', title: 'Proposal' },
  { field: 'proposalId', title: 'Proposal ID' },
  {
    title: 'Starts at',
    render: (rowData) => toTzLessDateTime(rowData.startsAt),
  },
  { title: 'Ends at', render: (rowData) => toTzLessDateTime(rowData.endsAt) },
  { field: 'equipmentAssignmentStatus', title: 'Status' },
  { field: 'scheduledBy', title: 'Scheduled by' },
];

export default function ViewRequests() {
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmation } = useContext(AppContext);
  const { loading: scheduledEventsLoading, scheduledEvents } =
    useEquipmentScheduledEvents({
      equipmentIds: [], // NOTE: Empty array is used to load all equipments.
      startsAt: toTzLessDateTime(moment(new Date()).startOf('day')),
      endsAt: toTzLessDateTime(moment(new Date()).add(1, 'year').endOf('day')),
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
    <ContentContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            <div data-cy="equipments-requests-table">
              <MaterialTable
                icons={tableIcons}
                title="Equipment booking requests"
                columns={columns}
                data={rows}
                options={{ search: false }}
                isLoading={scheduledEventsLoading || confirmationLoading}
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
    </ContentContainer>
  );
}
