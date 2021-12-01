import MaterialTable, { Column } from '@material-table/core';
import ViewIcon from '@material-ui/icons/Visibility';
import React from 'react';

import { tableIcons } from 'components/common/TableIcons';
import { ScheduledEventFilter } from 'generated/sdk';

import { CalendarScheduledEvent, getBookingTypeStyle } from './Event';
import Toolbar from './Toolbar';

type TableViewProps = {
  filter: ScheduledEventFilter;
  events: CalendarScheduledEvent[];
  onSelectEvent: (data: CalendarScheduledEvent) => void;
};
const TableView: React.FC<TableViewProps> = ({
  filter,
  events,
  onSelectEvent,
}) => {
  const columns: Column<CalendarScheduledEvent>[] = [
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

  const ViewTableRowIcon = (rowData: CalendarScheduledEvent) => (
    <ViewIcon
      style={{
        ...getBookingTypeStyle(rowData.bookingType, rowData.status),
        backgroundColor: 'inherit',
        filter: 'none',
      }}
    />
  );

  return (
    <div data-cy="scheduled-events-table">
      <Toolbar
        filter={filter}
        shouldIncludeCalendarNavigation
        shouldIncludeLabelText
      />
      <MaterialTable
        icons={tableIcons}
        title="Scheduled events"
        columns={columns}
        data={events}
        options={{
          rowStyle: (rowData: CalendarScheduledEvent) =>
            getBookingTypeStyle(rowData.bookingType, rowData.status),

          pageSize: 10,
        }}
        actions={[
          (rowData) => ({
            icon: () => ViewTableRowIcon(rowData),
            tooltip: 'View event',
            onClick: (_event, rowData) => {
              onSelectEvent(rowData as CalendarScheduledEvent);
            },
            position: 'row',
          }),
        ]}
      />
    </div>
  );
};

export default TableView;
