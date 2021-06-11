import moment from 'moment';
import React from 'react';
import {
  CalendarProps,
  DateLocalizer,
  NavigateAction,
} from 'react-big-calendar';
// @ts-expect-error For now seems like TimeGrid can't be imported otherwise.
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

/**
 * NOTE: This is done using `TimeGrid` component from react-big-calendar but that is like longer week view which is not the optimal and most wanted scenario.
 * We would like to show instruments instead of hours(TimeGutter) on the very left side and show how much that specific instrument is booked through the selected time span of either 3 or 6 months.
 * To achieve this we need some more time and create some very custom component that uses some small blocks from react-big-calendar components.
 * What can be helpful is https://github.com/jquense/react-big-calendar/blob/master/src/TimeGrid.js where instead of TimeGutter we should render some list of selected instruments and try to render and position the events correctly trough the selected timespan. Maybe some other components could be useful as well from react-big-calendar to achieve this.
 */
class YearView extends React.Component<CalendarProps> {
  static range: (date: Date) => Date[];
  static navigate: (newDate: Date, newView: NavigateAction) => Date;
  static title: (
    date: Date,
    { localizer }: { localizer: DateLocalizer }
  ) => string;

  render() {
    const { date } = this.props;
    const range = YearView.range(date as Date);

    return (
      <div data-cy="calendar-yearly-view" className="calendar-yearly-view">
        <TimeGrid {...this.props} range={range} eventOffset={15} />
      </div>
    );
  }
}

YearView.range = (date: Date) => {
  const start = date;
  // TODO: This should be adjustable length but for now it is fixed amount of 3 months
  const end = moment(start).add(3, 'months').toDate();

  let current = start;
  const range = [];

  while (moment(end).isSameOrAfter(current)) {
    range.push(current);
    current = moment(current).add(1, 'days').toDate();
  }

  return range;
};

YearView.navigate = (newDate: Date, action: NavigateAction) => {
  switch (action) {
    case 'PREV':
      // TODO: This should be adjustable length but for now it is fixed amount of 3 months
      return moment(newDate).subtract(3, 'months').toDate();

    case 'NEXT':
      // TODO: This should be adjustable length but for now it is fixed amount of 3 months
      return moment(newDate).add(3, 'months').toDate();

    default:
      return newDate;
  }
};

YearView.title = (date: Date, { localizer }) => {
  const firstOfMonth = moment(date).startOf('month').toDate();
  const endOfPeriod = moment(firstOfMonth).add(3, 'months').toDate();
  const lastDayOfMonth = moment(endOfPeriod).endOf('month').toDate();

  return `${localizer.format(
    firstOfMonth,
    'monthHeaderFormat',
    ''
  )} - ${localizer.format(lastDayOfMonth, 'monthHeaderFormat', '')}`;
};

export default YearView;
