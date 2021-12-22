import MaterialTable, { Column } from '@material-table/core';
import { Button, Grid } from '@material-ui/core';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import { ActionButtonContainer } from 'components/common/ActionButtonContainer';
import { tableIcons } from 'components/common/TableIcons';
import { PATH_CREATE_EQUIPMENT } from 'components/paths';
import useEquipments from 'hooks/equipment/useEquipments';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';

export type EquipmentTableRow = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
};

const columns: Column<EquipmentTableRow>[] = [
  { field: 'name', title: 'Name' },
  { field: 'description', title: 'Description' },
  {
    title: 'Color',
    render: (rowData) =>
      rowData.color ? (
        <>
          <span
            style={{
              backgroundColor: rowData.color,
              padding: '2px 20px',
              marginRight: '8px',
            }}
          ></span>
          {rowData.color}
        </>
      ) : (
        'None'
      ),
  },
];

export default function Equipments() {
  const { equipments, loading } = useEquipments();
  const [editEquipmentId, setEditEquipmentId] = useState(0);

  if (editEquipmentId) {
    return <Redirect push to={`/equipments/${editEquipmentId}`} />;
  }

  return (
    <ContentContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]} data-cy="role-selection-table">
            <MaterialTable
              icons={tableIcons}
              title="Equipments"
              columns={columns}
              data={equipments}
              isLoading={loading}
              actions={[
                {
                  icon: VisibilityIcon,
                  tooltip: 'View equipment',
                  onClick: (_event, rowData) =>
                    setEditEquipmentId((rowData as EquipmentTableRow).id),
                  position: 'row',
                },
              ]}
            />
            <ActionButtonContainer>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to={PATH_CREATE_EQUIPMENT}
                data-cy="btn-new-equipment"
              >
                New equipment
              </Button>
            </ActionButtonContainer>
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
