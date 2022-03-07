// NOTE: Initial data that already exists when we reset DB.
export default {
  equipments: [
    {
      id: 1,
      name: 'Available equipment 1 - no auto accept',
      description: '',
      ownerUserId: 1,
      autoAccept: false,
    },
    {
      id: 2,
      name: 'Available equipment 2 - auto accept',
      description: '',
      ownerUserId: 1,
      autoAccept: true,
    },
    {
      id: 5,
      name: 'Under maintenance 1 - not started yet',
      description: '',
      ownerUserId: 1,
      autoAccept: false,
    },
    {
      id: 7,
      name: 'Under maintenance 3 - finished',
      description: '',
      ownerUserId: 1,
      autoAccept: false,
    },
  ],
  proposal: {
    proposalId: '999999',
    title: 'Test proposal',
    proposer: 'Carl Carlsson',
  },
  proposalBooking: {
    id: 1,
  },
  instruments: [
    {
      id: 1,
      name: 'Instrument 1',
    },
    { id: 2, name: 'Instrument 2' },
    { id: 3, name: 'Instrument 3' },
  ],
  instrumentScientists: [{ id: 100 }],
};
