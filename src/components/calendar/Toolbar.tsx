import moment from 'moment';
import React from 'react';
import { View, Views } from 'react-big-calendar';
// @ts-expect-error Using the toolbar from react-big-calendar but they are not exporting it.
import CalendarNavigationToolbar from 'react-big-calendar/lib/Toolbar';
import { useHistory } from 'react-router';

import { ScheduledEventFilter } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

import {
  isSchedulerViewPeriod,
  SchedulerViewPeriod,
} from './CalendarViewContainer';
import InstrumentAndEquipmentFilter from './InstrumentAndEquipmentFilter';

const calendarNavigationToolbarButtonsText = {
  messages: {
    today: 'Today',
    next: 'Next',
    previous: 'Back',
    day: 'Day',
    week: 'Week',
    month: 'Month',
  },
};

const calendarNavigationToolbarViewOptions = [
  Views.DAY,
  Views.WEEK,
  Views.MONTH,
];

export const getLabelText = (
  queryView: SchedulerViewPeriod,
  startsAt: string
) => {
  switch (queryView) {
    case 'day':
      return moment(startsAt).format('dddd, DD MMMM YYYY');
    case 'week':
      const startDate = moment(startsAt);
      const endDate = moment(startsAt).add(1, queryView);
      const sameStartAndEndMonth = startDate.month() === endDate.month();

      const intervalEndDateFormat = sameStartAndEndMonth ? 'DD' : 'MMMM DD';

      const weekViewIntervalText = `${startDate.format(
        'MMMM DD'
      )} - ${endDate.format(intervalEndDateFormat)}`;

      return weekViewIntervalText;

    default:
      return moment(startsAt).format('MMMM YYYY');
  }
};

const Toolbar = ({
  filter,
  shouldIncludeCalendarNavigation = false,
  multipleInstruments = false,
  shouldIncludeLabelText = false,
}: {
  filter: ScheduledEventFilter;
  shouldIncludeCalendarNavigation?: boolean;
  multipleInstruments?: boolean;
  shouldIncludeLabelText?: boolean;
}) => {
  const query = useQuery();
  const history = useHistory();
  const startsAt = filter.startsAt;
  const queryView = (query.get('viewPeriod') ||
    Views.WEEK) as SchedulerViewPeriod;

  return (
    <>
      <InstrumentAndEquipmentFilter multipleInstruments={multipleInstruments} />
      {shouldIncludeCalendarNavigation && (
        <CalendarNavigationToolbar
          view={queryView}
          localizer={calendarNavigationToolbarButtonsText}
          views={calendarNavigationToolbarViewOptions}
          label={
            shouldIncludeLabelText ? getLabelText(queryView, startsAt) : ''
          }
          onNavigate={(direction: 'PREV' | 'NEXT' | 'TODAY') => {
            let newStartsAt: moment.Moment;

            switch (direction) {
              case 'PREV':
                newStartsAt = moment(startsAt)
                  .subtract(1, queryView)
                  .startOf(queryView);
                break;

              case 'TODAY':
                newStartsAt = moment().startOf(queryView);
                break;

              default:
                newStartsAt = moment(startsAt)
                  .add(1, queryView)
                  .startOf(queryView);
                break;
            }

            query.set('startsAt', newStartsAt.format(TZ_LESS_DATE_TIME_FORMAT));
            history.push(`?${query}`);
          }}
          onView={(view: View) => {
            if (isSchedulerViewPeriod(view)) {
              const newStartsAt = moment(startsAt).startOf(view);

              query.set(
                'startsAt',
                newStartsAt.format(TZ_LESS_DATE_TIME_FORMAT)
              );
              query.set('viewPeriod', view);
              history.push(`?${query}`);
            }
          }}
        />
      )}
    </>
  );
};

export default Toolbar;
