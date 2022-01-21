import MaterialTable, { Column } from '@material-table/core';
import { Visibility } from '@mui/icons-material';
import React from 'react';

import { tableIcons } from 'components/common/TableIcons';
import useProposalBookingLostTimes, {
  ProposalBookingLostTime,
} from 'hooks/lostTime/useProposalBookingLostTimes';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { toTzLessDateTime } from 'utils/date';

type ProposalBookingLostTimeTableProps = {
  proposalBooking: InstrumentProposalBooking;
  handleOnViewEvent: (eventId: number) => void;
};

export default function ProposalBookingLostTimeTable({
  proposalBooking,
  handleOnViewEvent,
}: ProposalBookingLostTimeTableProps) {
  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id
  );

  const columns: Column<ProposalBookingLostTime>[] = [
    {
      title: 'Starts at',
      render: (rowData) => toTzLessDateTime(rowData.startsAt),
    },
    {
      title: 'Ends at',
      render: (rowData) => toTzLessDateTime(rowData.endsAt),
    },
  ];

  return (
    <MaterialTable
      icons={tableIcons}
      title="Lost times"
      isLoading={loading}
      columns={columns}
      data={lostTimes}
      actions={[
        {
          icon: Visibility,
          tooltip: 'View event',
          onClick: (_event, rowData) => {
            handleOnViewEvent(
              (rowData as ProposalBookingLostTime).scheduledEventId
            );
          },
          position: 'row',
        },
      ]}
      options={{
        search: false,
        paging: false,
      }}
    />
  );
}
