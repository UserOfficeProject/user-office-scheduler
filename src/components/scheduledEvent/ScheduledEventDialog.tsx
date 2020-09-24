import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import { createScheduledEventValidationSchema } from '@esss-swap/duo-validation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React from 'react';

import { ScheduledEventBookingType, ScheduledEvent } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';

import ScheduledEventForm, { BookingTypesMap } from './ScheduledEventForm';

export type SlotInfo = {
  start: Date | string;
  end: Date | string;
  slots: Date[] | string[];
  action: 'select' | 'click' | 'doubleClick';
};

const createValidationSchema = createScheduledEventValidationSchema(
  BookingTypesMap
);

type ScheduledEventDialogProps = {
  selectedEvent:
    | Pick<
        ScheduledEvent,
        'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
      >
    | SlotInfo
    | null;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

export default function ScheduledEventDialog({
  selectedEvent,
  isDialogOpen,
  closeDialog,
}: ScheduledEventDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const api = useUnauthorizedApi();

  const isEdit = selectedEvent && 'id' in selectedEvent;

  const initialValues =
    selectedEvent && 'id' in selectedEvent
      ? {
          bookingType: selectedEvent.bookingType,
          startsAt: parseTzLessDateTime(selectedEvent.startsAt),
          endsAt: parseTzLessDateTime(selectedEvent.endsAt),
          description: selectedEvent.description ?? '',
        }
      : {
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
        onSubmit={async values => {
          const {
            createScheduledEvent: { error },
          } = await api().createScheduledEvent({
            input: {
              // validation should take care about this
              bookingType: values.bookingType as ScheduledEventBookingType,
              endsAt: toTzLessDateTime(values.endsAt),
              startsAt: toTzLessDateTime(values.startsAt),
              scheduledById: '0', // FIXME: fix after auth is added
              description: values.description,
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
