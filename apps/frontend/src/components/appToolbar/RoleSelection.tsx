import MaterialTable from '@material-table/core';
import Button from '@mui/material/Button';
import { ClientError } from 'graphql-request';
import { useSnackbar } from 'notistack';
import React, { useContext, useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';

import { tableIcons } from 'components/common/TableIcons';
import { UserContext } from 'context/UserContext';
import { Role } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

const columns = [
  {
    title: 'Action',
    field: 'roleAction',
  },
  { title: 'Role', field: 'title' },
];

const RoleSelection: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentRole, token, handleNewToken } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const api = useDataApi();
  const history = useHistory();
  const [roles, setRoles] = useState<Role[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let unmounted = false;

    const getUserInformation = async () => {
      setLoading(true);
      const data = await api().getMyRoles();
      if (unmounted) {
        return;
      }

      if (data?.me) {
        /** NOTE: We have roles that are duplicated in role_id and user_id but different only in sep_id
         *  which is used to determine if the user with that role is member of a SEP.
         */
        setRoles(data.me?.roles);
        setLoading(false);
      }
    };
    getUserInformation();

    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!roles) {
    return <Redirect to="/SignIn" />;
  }

  const selectUserRole = async (role: Role) => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const result = await api().selectRole({
        token,
        selectedRoleId: role.id,
      });

      handleNewToken(result.selectRole);
      history.push('/');

      setTimeout(() => {
        if (!result.selectRole) {
          return;
        }

        onClose();
      }, 500);
    } catch (error) {
      // TODO: This should be removed once we do error handling refactor
      const [graphQLError] = (error as ClientError).response?.errors ?? [];

      enqueueSnackbar(graphQLError?.message ?? 'Login failed.', {
        variant: 'error',
      });
    }
  };

  const RoleAction = (rowData: Role) => (
    <>
      {rowData.shortCode.toUpperCase() === currentRole?.valueOf() ? (
        <Button variant="text" disabled>
          In Use
        </Button>
      ) : (
        <Button
          variant="text"
          disabled={loading}
          onClick={() => selectUserRole(rowData)}
        >
          Use
        </Button>
      )}
    </>
  );

  const rolesWithRoleAction = roles.map((role) => ({
    ...role,
    roleAction: RoleAction(role),
  }));

  return (
    <div data-cy="role-selection-table">
      <MaterialTable
        icons={tableIcons}
        title="User roles"
        columns={columns}
        data={rolesWithRoleAction}
        isLoading={loading}
        options={{
          search: false,
          paging: false,
          minBodyHeight: '350px',
        }}
      />
    </div>
  );
};

export default RoleSelection;
