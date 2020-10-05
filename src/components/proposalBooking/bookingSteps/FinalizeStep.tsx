import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
} from '@material-ui/core';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import React, { useState } from 'react';

import SplitButton from 'components/common/SplitButton';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import TimeTable from '../TimeTable';

const rows = [
  {
    id: '123',
    startsAt: moment()
      .startOf('hour')
      .toDate(),
    endsAt: moment()
      .startOf('hour')
      .add(1, 'hour')
      .toDate(),
  },
  {
    id: '567',
    startsAt: moment()
      .startOf('hour')
      .toDate(),
    endsAt: moment()
      .startOf('hour')
      .add(1, 'hour')
      .toDate(),
  },
  {
    id: '7889',
    startsAt: moment()
      .startOf('hour')
      .toDate(),
    endsAt: moment()
      .startOf('hour')
      .add(1, 'hour')
      .toDate(),
  },
];

type BookingEventStepProps = {
  proposalBooking: InstrumentProposalBooking;
};

type ExpandTypes = 'logLostTime' | 'closeWithoutLog' | false;

export default function BookingEventStep({
  proposalBooking,
}: BookingEventStepProps) {
  const [expanded, setExpanded] = useState<ExpandTypes>('logLostTime');
  const [warningAccepted, setWarningAccepted] = useState(false);

  const handleChange = (expanded: ExpandTypes) => (
    e: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setWarningAccepted(false);
    setExpanded(isExpanded ? expanded : false);
  };

  return (
    <>
      <DialogContent>
        <Accordion
          elevation={2}
          expanded={expanded === 'logLostTime'}
          onChange={handleChange('logLostTime')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Log lost time
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            <TimeTable
              editable
              rows={rows}
              titleComponent={
                <>
                  Lost time
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    style={{ marginLeft: 16 }}
                  >
                    Add
                  </Button>
                </>
              }
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                options={[
                  'Save and close proposal booking',
                  'Save and restart the booking process',
                ]}
                disabled={!warningAccepted}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          elevation={2}
          expanded={expanded === 'closeWithoutLog'}
          onChange={handleChange('closeWithoutLog')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Close without logging lost time
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            <div style={{ margin: 8 }}>
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
              <Button
                variant="contained"
                color="primary"
                disabled={!warningAccepted}
              >
                Close proposal booking
              </Button>
            </div>
            <div style={{ marginTop: 8 }}>
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Lorem ipsum
              </Alert>
            </div>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
    </>
  );
}
