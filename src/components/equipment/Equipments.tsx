import MaterialTable, { Column } from '@material-table/core';
import { Grid } from '@material-ui/core';
import { Visibility as VisibilityIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { Redirect } from 'react-router';

import { tableIcons } from 'components/common/TableIcons';
import useEquipments from 'hooks/equipment/useEquipments';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';

export type EquipmentTableRow = {
  id: number;
  name: string;
  description: string | null;
};

const columns: Column<EquipmentTableRow>[] = [
  { field: 'name', title: 'Name' },
  { field: 'description', title: 'Description' },
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
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
