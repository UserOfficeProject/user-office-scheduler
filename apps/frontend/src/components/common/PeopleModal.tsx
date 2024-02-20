import AddBox from '@mui/icons-material/AddBox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';

import PeopleTable from 'components/common/PeopleTable';
import { UserRole, BasicUserDetailsFragment } from 'generated/sdk';

function PeopleModal(props: {
  title: string;
  addParticipants: (data: BasicUserDetailsFragment[]) => void;
  show: boolean;
  close: () => void;
  selection?: boolean;
  selectedUsers?: BasicUserDetailsFragment[] | null;
  userRole?: UserRole;
  data?: BasicUserDetailsFragment[];
}) {
  const addUser = (rowData: BasicUserDetailsFragment) => {
    props.addParticipants([
      {
        id: rowData.id,
        firstname: rowData.firstname,
        lastname: rowData.lastname,
        institution: rowData.institution,
        position: rowData.position,
        placeholder: rowData.placeholder,
      },
    ]);
  };

  return (
    <Dialog
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.show}
      onClose={() => props.close()}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <PeopleTable
          title={props.title}
          action={{
            fn: addUser,
            actionText: 'Select user',
            actionIcon: <AddBox data-cy="select-user" />,
          }}
          selectedUsers={props.selectedUsers}
          selection={!!props.selection}
          userRole={props.userRole}
          onUpdate={props.addParticipants}
          data={props.data}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PeopleModal;
