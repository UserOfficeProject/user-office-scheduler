import { util } from '@esss-swap/duo-validation';
import moment from 'moment';
import * as Yup from 'yup';

// re-use the same validation logic
export const bulkUpsertLostTimeValidationSchema = Yup.object().shape({
  proposalBookingId: util.NumericalID.required(
    'ProposalBooking ID is required'
  ),
  lostTimes: Yup.array()
    .of(
      Yup.object().shape({
        id: util.ID.required('LostTime ID is required'),
        startsAt: Yup.date().typeError(util.TYPE_ERR_INVALID_DATE).required(),

        endsAt: Yup.date()
          .typeError(util.TYPE_ERR_INVALID_DATE)
          .when('startsAt', (startsAt: Date) => {
            const min = moment(startsAt).add(1, 'minute');

            return Yup.date().min(
              min.toDate(),
              util.atOrLaterThanMsg(min.format(util.TZ_LESS_DATE_TIME_FORMAT))
            );
          })
          .required(),
      })
    )
    .max(50), // hard limit
});
