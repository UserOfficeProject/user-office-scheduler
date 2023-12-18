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
  users: {
    officer: {
      id: 2,
      firstName: 'Anders',
      lastName: 'Andersson',
      email: 'Aaron_Harris49@gmail.com',
      password: 'Test1234!',
    },
    instrumentScientist1: {
      id: 100,
      email: 'instr.sci1@local.host',
      password: 'Test1234!',
      firstname: 'Instrument',
      lastname: 'Scientist1',
    },
    instrumentScientist2: {
      id: 101,
      email: 'instr.sci2@local.host',
      password: 'Test1234!',
      firstname: 'Instrument',
      lastname: 'Scientist2',
    },
  },
};
