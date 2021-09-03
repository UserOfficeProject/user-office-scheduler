import { Grid, TableCell, IconButton, Button } from '@material-ui/core';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import React from 'react';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';

import Table, { HeadCell } from 'components/common/Table';
import { PATH_VIEW_EQUIPMENT, PATH_CREATE_EQUIPMENT } from 'components/paths';
import useEquipments from 'hooks/equipment/useEquipments';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';

export type EquipmentTableRow = {
  id: number;
  name: string;
};

const defaultHeadCells: HeadCell<EquipmentTableRow>[] = [
  { id: 'name', label: 'Name' },
];

export default function Equipments() {
  const { equipments } = useEquipments();

  const RowActions = ({ row }: { row: EquipmentTableRow }) => {
    return (
      <Link
        to={generatePath(PATH_VIEW_EQUIPMENT, { id: row.id })}
        data-cy="btn-view-equipment"
      >
        <IconButton>
          <VisibilityIcon />
        </IconButton>
      </Link>
    );
  };

  return (
    <ContentContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            <Table
              defaultOrderBy="name"
              tableTitle="Equipments"
              headCells={defaultHeadCells}
              rows={equipments}
              rowActions={RowActions}
              extractKey={(el) => el.id}
              showEmptyRows
              renderRow={(row) => {
                return (
                  <>
                    <TableCell align="left">{row.name}</TableCell>
                  </>
                );
              }}
            />
            <div>
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
            </div>
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
