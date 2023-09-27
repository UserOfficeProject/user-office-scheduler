import DeleteIcon from '@mui/icons-material/Delete';
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
import React, { useContext, useState } from 'react';
import { stringOrDate } from 'react-big-calendar';

import CloseDialogButton from 'components/common/CloseDialogButton';
import { AppContext } from 'context/AppContext';
import { ScheduledEventBookingType, Maybe } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import {
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
  toTzLessDateTime,
} from 'utils/date';

import ScheduledEventForm, {
  CalendarExplicitBookableTypes,
} from './ScheduledEventForm';

export type SlotInfo = {
  start: stringOrDate;
  end: stringOrDate;
  slots: stringOrDate[];
  action: 'select' | 'click' | 'doubleClick';
};

export type BackgroundEvent = {
  id: number;
  bookingType: ScheduledEventBookingType;
  startsAt: stringOrDate;
  endsAt: stringOrDate;
  instrument: Maybe<PartialInstrument>;
  description: Maybe<string>;
};

const createValidationSchema = createScheduledEventValidationSchema(
  CalendarExplicitBookableTypes
);

type ScheduledEventDialogProps = {
  selectedEvent: BackgroundEvent | SlotInfo | null;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const { showConfirmation } = useContext(AppContext);

  const isEdit = selectedEvent && 'id' in selectedEvent;
  const firstSelectedInstrumentId = selectedInstrumentIds[0] ?? '';

  const initialValues =
    selectedEvent && 'id' in selectedEvent
      ? {
          instrument: selectedEvent.instrument?.id,
          bookingType: selectedEvent.bookingType,
          startsAt: moment(selectedEvent.startsAt),
          endsAt: moment(selectedEvent.endsAt),
          description: selectedEvent.description ?? '',
        }
      : {
          instrument: firstSelectedInstrumentId,
          bookingType: '',
          startsAt: moment(selectedEvent?.start),
          endsAt: moment(selectedEvent?.end),
          description: '',
        };

  const handleScheduledEventDelete = async () => {
    if (!isEdit) {
      return;
    }

    showConfirmation({
      message: (
        <>
          Are you sure you want to delete{' '}
          <strong>{selectedEvent.bookingType}</strong> (
          {moment(selectedEvent.startsAt).format(
            TZ_LESS_DATE_TIME_LOW_PREC_FORMAT
          )}{' '}
          -{' '}
          {moment(selectedEvent.endsAt).format(
            TZ_LESS_DATE_TIME_LOW_PREC_FORMAT
          )}
          ) scheduled event?
        </>
      ),
      cb: async () => {
        setIsDeleting(true);
        if (!selectedEvent.instrument) {
          return;
        }

        const {
          deleteScheduledEvents: { error },
        } = await api().deleteScheduledEvents({
          input: {
            ids: [selectedEvent.id],
            instrumentId: selectedEvent.instrument.id,
          },
        });

        setIsDeleting(false);

        if (error) {
          enqueueSnackbar(getTranslation(error as ResourceId), {
            variant: 'error',
          });
        } else {
          enqueueSnackbar('Scheduled event removed successfully', {
            variant: 'success',
          });
          closeDialog(true);
        }
      },
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => closeDialog()}
      data-cy="schedule-background-event"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={createValidationSchema}
        onSubmit={async (values): Promise<void> => {
          if (!values.instrument) {
            return;
          }

          if (isEdit) {
            const {
              updateScheduledEvent: { error },
            } = await api().updateScheduledEvent({
              input: {
                scheduledEventId: selectedEvent.id,
                instrumentId: +values.instrument,
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
          } else {
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
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <DialogTitle>Event</DialogTitle>
              <CloseDialogButton onClick={() => closeDialog()} />
              <DialogContent>
                <ScheduledEventForm />
              </DialogContent>
              <DialogActions>
                {isEdit && (
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={isSubmitting || isDeleting}
                    startIcon={<DeleteIcon />}
                    onClick={handleScheduledEventDelete}
                    data-cy="delete-event"
                  >
                    Delete
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || isDeleting}
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
