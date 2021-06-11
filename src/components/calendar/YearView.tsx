import moment from 'moment';
import React from 'react';
import {
  CalendarProps,
  DateLocalizer,
  NavigateAction,
} from 'react-big-calendar';
// @ts-expect-error For now seems like TimeGrid can't be imported otherwise.
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

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
