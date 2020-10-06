import {
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import SplitButton from 'components/common/SplitButton';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import TimeTable, { TimeTableRow } from '../TimeTable';

const _rows: TimeTableRow[] = [];

type FinalizeStepProps = {
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function FinalizeStep({
  proposalBooking,
  isDirty,
  handleSetDirty,
}: FinalizeStepProps) {
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [rows, setRows] = useState<TimeTableRow[]>(_rows);

  const handleAdd = () => {
    !isDirty && handleSetDirty(true);
    setRows(rows => [
      ...rows,
      {
        id: `tmp-${Date.now()}`,
        newlyCreated: true,
        startsAt: moment().startOf('hour'),
        endsAt: moment()
          .startOf('hour')
          .add(1, 'hour'),
      },
    ]);
  };

  const handleSave = (id: string, startsAt: Moment, endsAt: Moment) => {
    !isDirty && handleSetDirty(true);

    setRows(
      rows.map(row => {
        if (row.id !== id) {
          return row;
        }

        return {
          ...row,
          startsAt,
          endsAt,
        };
      })
    );
  };

  const handleDelete = (ids: string[]) => {
    !isDirty && handleSetDirty(true);

    setRows(rows.filter(row => !ids.includes(row.id)));
  };

  return (
    <>
      <DialogContent>
        <TimeTable
          editable
          maxHeight={380}
          rows={rows}
          onDelete={handleDelete}
          onSave={handleSave}
          titleComponent={
            <>
              Lost time
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginLeft: 16 }}
                onClick={handleAdd}
              >
                Add
              </Button>
            </>
          }
        />
        <div>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 8 + 8 + 8,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={warningAccepted}
                onChange={() => setWarningAccepted(prev => !prev)}
                name="warningAccepted"
                color="primary"
              />
            }
            label="I wish to proceed"
          />
          <SplitButton
            options={['Close proposal booking', 'Restart the booking process']}
            disabled={!warningAccepted}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Lorem ipsum
          </Alert>
        </div>
      </DialogContent>
    </>
  );
}
