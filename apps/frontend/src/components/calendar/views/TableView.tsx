import MaterialTable, { Column } from '@material-table/core';
import { EventAvailable } from '@mui/icons-material';
import ViewIcon from '@mui/icons-material/Visibility';
import { Alert, IconButton, Tooltip, useTheme } from '@mui/material';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { tableIcons } from 'components/common/TableIcons';
import { AppContext } from 'context/AppContext';
import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
  ScheduledEventFilter,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

import { CalendarScheduledEventWithUniqueId } from '../CalendarViewContainer';
import { getBookingTypeStyle } from '../common/Event';
import Toolbar from '../common/Toolbar';

type TableViewProps = {
  filter: ScheduledEventFilter;
  events: CalendarScheduledEventWithUniqueId[];
  refresh: () => void;
  onSelectEvent: (data: CalendarScheduledEventWithUniqueId) => void;
};
const TableView: React.FC<TableViewProps> = ({
  filter,
  events,
  refresh,
  onSelectEvent,
}) => {
  const theme = useTheme();
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmation } = useContext(AppContext);
  const [selectedExperimentTimes, setSelectedExperimentTimes] = useState<
    CalendarScheduledEventWithUniqueId[]
  >([]);

  const ViewTableRowIcon = (rowData: CalendarScheduledEventWithUniqueId) => (
    <ViewIcon
      style={{
        ...getBookingTypeStyle(rowData),
        filter: 'none',
      }}
    />
  );

  /**
   * NOTE: Custom action buttons are here because when we have them inside actions on the material-table
   * and selection flag is true they are not working properly.
   */
  const RowActionButtons = (rowData: CalendarScheduledEventWithUniqueId) => (
    <Tooltip title="View event">
      <IconButton
        data-cy="view-proposal"
        onClick={() => {
          onSelectEvent(rowData as CalendarScheduledEventWithUniqueId);
        }}
        sx={{ p: theme.spacing(1) }}
      >
        {ViewTableRowIcon(rowData)}
      </IconButton>
    </Tooltip>
  );

  // NOTE: Including the action buttons as property to avoid the console warning(https://github.com/material-table-core/core/issues/286)
  const eventsWithActions = events.map((event) => ({
    ...event,
    rowActionButtons: RowActionButtons(event),
  }));

  const columns: Column<CalendarScheduledEventWithUniqueId>[] = [
    {
      title: 'Actions',
      cellStyle: { padding: 0 },
      sorting: false,
      removable: false,
      field: 'rowActionButtons',
    },
    {
      title: 'Booking type',
      field: 'bookingTypeTableRenderValue',
    },
    {
      title: 'Starts at',
      field: 'startTableRenderValue',
    },
    {
      title: 'Ends at',
      field: 'endTableRenderValue',
    },
    { title: 'Description', field: 'description' },
    { title: 'Status', field: 'statusTableRenderValue' },
    { title: 'Instrument', field: 'instrument.name' },
    { title: 'Proposal', field: 'proposalBooking.proposal.title' },
    { title: 'Proposal ID', field: 'proposalBooking.proposal.proposalId' },
  ];

  const activateSelectedExperimentTimes = async (
    userOperationsExperimentsInDraftState: CalendarScheduledEventWithUniqueId[]
  ) => {
    try {
      if (!userOperationsExperimentsInDraftState.length) {
        return;
      }

      const {
        activateScheduledEvents: { error, scheduledEvents },
      } = await api().activateScheduledEvents({
        input: {
          ids: userOperationsExperimentsInDraftState.map(
            (item) => item.eventId
          ),
        },
      });

      const activatedEvents = scheduledEvents.filter((event) => 'id' in event);

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else if (
        activatedEvents.length !== userOperationsExperimentsInDraftState.length
      ) {
        enqueueSnackbar(
          'Some of the selected experiment times could not be activated. Please make sure that all their equipment booking requests are accepted',
          {
            variant: 'error',
          }
        );

        if (activatedEvents.length) {
          refresh();
        }
      } else {
        enqueueSnackbar('Experiment times activated successfully!', {
          variant: 'success',
        });

        refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onActivateSelectedExperimentTimes = () => {
    const userOperationsExperimentsInDraftState =
      selectedExperimentTimes.filter(
        (experimentTime) =>
          experimentTime.status === ProposalBookingStatusCore.DRAFT &&
          experimentTime.bookingType ===
            ScheduledEventBookingType.USER_OPERATIONS
      );

    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>activate</strong> selected experiment
          times?
          {userOperationsExperimentsInDraftState.length !==
            selectedExperimentTimes.length && (
            <Alert severity="warning">
              You have selected some events that are not ready for{' '}
              <strong>activation</strong>. Only <strong>DRAFT</strong> events
              that are of type <strong>USER OPERATIONS</strong> with all
              equipment bookings <strong>accepted</strong> will be activated
            </Alert>
          )}
        </>
      ),
      cb: async () =>
        await activateSelectedExperimentTimes(
          userOperationsExperimentsInDraftState
        ),
    });
  };

  return (
    <div data-cy="scheduled-events-table">
      <Toolbar
        filter={filter}
        shouldIncludeCalendarNavigation
        shouldIncludeLabelText
        multipleInstruments
      />
      <MaterialTable
        icons={tableIcons}
        title="Scheduled events"
        columns={columns}
        data={eventsWithActions}
        onSelectionChange={(data) => setSelectedExperimentTimes(data)}
        options={{
          rowStyle: (rowData: CalendarScheduledEventWithUniqueId) =>
            getBookingTypeStyle(rowData),
          pageSize: 10,
          selection: true,
          headerSelectionProps: {
            inputProps: {
              'aria-label': 'Select All Rows',
              // 'data-cy': 'select-all-table-rows',
            },
          },
          selectionProps: (rowData: CalendarScheduledEventWithUniqueId) => ({
            style: {
              ...getBookingTypeStyle(rowData),
              filter: 'none',
            },
            inputProps: {
              'aria-label': `${rowData.start}-${rowData.end}-select`,
            },
          }),
        }}
        actions={[
          {
            icon: EventAvailable,
            tooltip: 'Activate selected experiment times',
            onClick: () => {
              onActivateSelectedExperimentTimes();
            },
            position: 'toolbarOnSelect',
          },
        ]}
      />
    </div>
  );
};

export default TableView;
