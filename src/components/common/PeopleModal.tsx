import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddBox from '@material-ui/icons/AddBox';
import React from 'react';

import PeopleTable from 'components/common/PeopleTable';
import { UserRole, BasicUserDetails } from 'generated/sdk';

function PeopleModal(props: {
  title: string;
  addParticipants: (data: BasicUserDetails[]) => void;
  show: boolean;
  close: () => void;
  selection?: boolean;
  selectedUsers?: number[] | null;
  userRole?: UserRole;
  data?: BasicUserDetails[];
}) {
  const addUser = (rowData: BasicUserDetails) => {
    props.addParticipants([
      {
        firstname: rowData.firstname,
        lastname: rowData.lastname,
        organisation: rowData.organisation,
        id: rowData.id,
      } as BasicUserDetails,
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
          onUpdate={(data) => props.addParticipants(data as BasicUserDetails[])}
          data={props.data}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PeopleModal;
