/* eslint-disable @typescript-eslint/no-explicit-any */
import MaterialTable, { Query, Options, Column } from '@material-table/core';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from 'react';

import { ActionButtonContainer } from 'components/common/ActionButtonContainer';
import { tableIcons } from 'components/common/TableIcons';
import { BasicUserDetails, UserRole } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

type BasicUserDetailsWithTableData = BasicUserDetails & {
  tableData?: {
    checked: boolean;
  };
};

function sendUserRequest(
  searchQuery: Query<any>,
  api: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedUsers: number[] | undefined | null,
  selectedParticipants: number[],
  userRole: UserRole | null
) {
  const variables = {
    filter: searchQuery.search,
    offset: searchQuery.pageSize * searchQuery.page,
    first: searchQuery.pageSize,
    subtractUsers: selectedUsers ? selectedUsers : [],
    userRole: userRole,
  };

  setLoading(true);

  return api()
    .getUsers(variables)
    .then((data: any) => {
      setLoading(false);

      return {
        page: searchQuery.page,
        totalCount: data?.users?.totalCount,
        data: data?.users?.users.map((user: BasicUserDetails) => {
          return {
            firstname: user.firstname,
            lastname: user.lastname,
            organisation: user.organisation,
            id: user.id,
            tableData: { checked: selectedParticipants.includes(user.id) },
          };
        }),
      };
    });
}

type PeopleTableProps<
  T extends BasicUserDetailsWithTableData = BasicUserDetailsWithTableData
> = {
  selection: boolean;
  isLoading?: boolean;
  title?: string;
  action?: {
    fn: (data: any) => void;
    actionIcon: JSX.Element;
    actionText: string;
  };
  isFreeAction?: boolean;
  data?: T[];
  search?: boolean;
  onRemove?: (item: any) => void;
  onUpdate?: (item: any[]) => void;
  selectedUsers?: number[] | null;
  mtOptions?: Options<T>;
  columns?: Column<any>[];
  userRole?: UserRole;
};

const useStyles = makeStyles({
  tableWrapper: {
    '& .MuiToolbar-gutters': {
      paddingLeft: '0',
    },
  },
  verticalCentered: {
    display: 'flex',
    alignItems: 'center',
  },
});

const tableColumns = [
  { title: 'Name', field: 'firstname' },
  { title: 'Surname', field: 'lastname' },
  { title: 'Organisation', field: 'organisation' },
];

const PeopleTable: React.FC<PeopleTableProps> = ({
  isLoading = false,
  data,
  action,
  selection,
  search,
  onRemove,
  onUpdate,
  columns,
  isFreeAction,
  mtOptions,
  selectedUsers,
  userRole,
  title,
}) => {
  const api = useDataApi();
  const [loading, setLoading] = useState(isLoading);
  const [pageSize, setPageSize] = useState(5);
  const [selectedParticipants, setSelectedParticipants] = useState<
    BasicUserDetails[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const [currentPageIds, setCurrentPageIds] = useState<number[]>([]);

  const classes = useStyles();

  useEffect(() => {
    if (isLoading !== undefined) {
      setLoading(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setCurrentPageIds(data.map(({ id }) => id));
  }, [data]);

  const actionArray = [];
  action &&
    !selection &&
    actionArray.push({
      icon: () => action.actionIcon,
      isFreeAction: isFreeAction,
      tooltip: action.actionText,
      onClick: (
        event: React.MouseEvent<JSX.Element>,
        rowData: BasicUserDetails | BasicUserDetails[]
      ) => action.fn(rowData),
    });

  const tableData = data
    ? (data as BasicUserDetailsWithTableData[])
    : (query: Query<BasicUserDetailsWithTableData>) => {
        if (searchText !== query.search) {
          setSearchText(query.search);
        }

        setPageSize(query.pageSize);

        return sendUserRequest(
          query,
          api,
          setLoading,
          selectedUsers,
          selectedParticipants.map(({ id }) => id),
          userRole || null
        ).then((users: any) => {
          setCurrentPageIds(users.data.map(({ id }: { id: number }) => id));

          return users;
        });
      };

  return (
    <div data-cy="equipment-responsible" className={classes.tableWrapper}>
      <MaterialTable
        icons={tableIcons}
        title={title}
        columns={columns ?? tableColumns}
        onSelectionChange={(selectedItems, selectedItem) => {
          // when the user wants to (un)select all items
          // `selectedItem` will be undefined
          if (!selectedItem) {
            // first clear the current page because if any row was unselected
            // the (un)select all option will select every rows
            // which would result in duplicates
            setSelectedParticipants((selectedParticipants) =>
              selectedParticipants.filter(
                ({ id }) => !currentPageIds.includes(id)
              )
            );

            if (selectedItems.length > 0) {
              setSelectedParticipants((selectedParticipants) => [
                ...selectedParticipants,
                ...(selectedItems.map((selectedItem) => ({
                  id: selectedItem.id,
                  firstname: selectedItem.firstname,
                  lastname: selectedItem.lastname,
                  organisation: selectedItem.organisation,
                })) as BasicUserDetails[]),
              ]);
            }

            return;
          }

          setSelectedParticipants((selectedParticipants) =>
            selectedItem.tableData?.checked
              ? ([
                  ...selectedParticipants,
                  {
                    id: selectedItem.id,
                    firstname: selectedItem.firstname,
                    lastname: selectedItem.lastname,
                    organisation: selectedItem.organisation,
                  },
                ] as BasicUserDetails[])
              : selectedParticipants.filter(({ id }) => id !== selectedItem.id)
          );
        }}
        data={tableData}
        isLoading={loading}
        options={{
          search: search,
          debounceInterval: 400,
          pageSize,
          selection: selection,
          ...mtOptions,
        }}
        actions={actionArray}
        editable={
          onRemove
            ? {
                onRowDelete: (oldData) =>
                  new Promise<void>((resolve) => {
                    resolve();
                    onRemove?.(oldData);
                  }),
              }
            : {}
        }
      />
      {selection && (
        <ActionButtonContainer>
          <div className={classes.verticalCentered}>
            {selectedParticipants.length} user(s) selected
          </div>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => {
              if (onUpdate) {
                onUpdate(selectedParticipants);
                setSelectedParticipants([]);
              }
            }}
            disabled={selectedParticipants.length === 0}
            data-cy="assign-selected-users"
          >
            Update
          </Button>
        </ActionButtonContainer>
      )}
    </div>
  );
};

export default PeopleTable;
