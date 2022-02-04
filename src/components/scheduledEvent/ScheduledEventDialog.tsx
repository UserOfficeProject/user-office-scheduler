import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import { createScheduledEventValidationSchema } from '@user-office-software/duo-validation';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React from 'react';
import { stringOrDate } from 'react-big-calendar';

import {
  ScheduledEventBookingType,
  ScheduledEvent,
  Maybe,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';

import ScheduledEventForm, {
  CalendarExplicitBookableTypes,
} from './ScheduledEventForm';

export type SlotInfo = {
  start: stringOrDate;
  end: stringOrDate;
  slots: stringOrDate[];
  action: 'select' | 'click' | 'doubleClick';
};

const createValidationSchema = createScheduledEventValidationSchema(
  CalendarExplicitBookableTypes
);

type ScheduledEventDialogProps = {
  selectedEvent:
    | (Pick<
        ScheduledEvent,
        'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
      > & { instrument: Maybe<PartialInstrument> })
    | SlotInfo
    | null;
  isDialogOpen: boolean;
  selectedInstrumentIds: number[];
  closeDialog: (shouldRefresh?: boolean) => void;
};

export default function ScheduledEventDialog({
  selectedEvent,
  isDialogOpen,
  selectedInstrumentIds,
  closeDialog,
}: ScheduledEventDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();

  const isEdit = selectedEvent && 'id' in selectedEvent;
  const firstSelectedInstrumentId = selectedInstrumentIds[0] ?? '';

  const initialValues =
    selectedEvent && 'id' in selectedEvent
      ? {
          instrument: selectedEvent.instrument?.id,
          bookingType: selectedEvent.bookingType,
          startsAt: parseTzLessDateTime(selectedEvent.startsAt),
          endsAt: parseTzLessDateTime(selectedEvent.endsAt),
          description: selectedEvent.description ?? '',
        }
      : {
          instrument: firstSelectedInstrumentId,
          bookingType: '',
          startsAt: moment(selectedEvent?.start),
          endsAt: moment(selectedEvent?.end),
          description: '',
        };

  return (
    <Dialog open={isDialogOpen} onClose={() => closeDialog()}>
      <Formik
        initialValues={initialValues}
        validationSchema={createValidationSchema}
        onSubmit={async (values): Promise<void> => {
          if (!values.instrument) {
            return;
          }

          const {
            createScheduledEvent: { error },
          } = await api().createScheduledEvent({
            input: {
              instrumentId: +values.instrument,
              // validation should take care about this
              bookingType: values.bookingType as ScheduledEventBookingType,
              endsAt: toTzLessDateTime(values.endsAt),
              startsAt: toTzLessDateTime(values.startsAt),
              description: values.description || null,
            },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            closeDialog(true);
          }
        }}
      >
        {({ isSubmitting, setSubmitting }) => {
          if (!isSubmitting && isEdit) {
            setSubmitting(true);
          }

          return (
            <Form>
              <DialogTitle>Event</DialogTitle>
              <DialogContent>
                <ScheduledEventForm />
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => closeDialog()}
                  disabled={!isEdit && isSubmitting}
                  data-cy="btn-close-dialog"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  data-cy="btn-save-event"
                >
                  {!isEdit && isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Save'
                  )}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
