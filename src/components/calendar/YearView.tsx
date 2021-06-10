import moment from 'moment';
import React from 'react';
import {
  CalendarProps,
  DateLocalizer,
  momentLocalizer,
  View,
} from 'react-big-calendar';
// @ts-expect-error Test
import { navigate } from 'react-big-calendar/lib/utils/constants';

const localizer = momentLocalizer(moment);

type CalendarType = {
  currentDate: moment.Moment;
  first: moment.Moment;
  last: moment.Moment;
  weeks: moment.Moment[][];
  year?: number;
  month?: number;
};

function createCalendar(currentDate?: moment.Moment) {
  if (!currentDate) {
    currentDate = moment();
  } else {
    currentDate = moment(currentDate);
  }

  const first = currentDate.clone().startOf('month');
  const last = currentDate.clone().endOf('month');
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar = Object.assign<[], CalendarType>([], {
    currentDate,
    first,
    last,
    weeks: [],
  });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week: moment.Moment[] = [];
    calendar.weeks.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = currentDate.clone().set('date', day + 1 - first.day());
      week.push(date);
    }
  }

  return calendar;
}

type CalendarDateProps = {
  dateToRender: moment.Moment;
  dateOfMonth: moment.Moment;
  onClick: (dateToRender: moment.Moment) => void;
};

function CalendarDate(props: CalendarDateProps) {
  const { dateToRender, dateOfMonth } = props;
  const today =
    dateToRender.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ? 'today'
      : '';

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button
      className={`date in-month ${today}`}
      onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender.date()}
    </button>
  );
}

class Calendar extends React.Component<
  CalendarProps,
  { calendar: CalendarType }
> {
  componentDidMount() {
    this.setState({ calendar: createCalendar(moment(this.props.date)) });
  }

  componentDidUpdate(prevProps: CalendarProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ calendar: createCalendar(moment(this.props.date)) });
    }
  }

  render() {
    if (!this.state?.calendar) {
      return null;
    }

    return (
      <div className="month">
        <div className="month-name">
          {this.state.calendar?.currentDate.format('MMMM').toUpperCase()}
        </div>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={index} className="day">
            {day}
          </span>
        ))}
        {this.state.calendar.weeks?.map(
          (week: moment.Moment[], index: number) => (
            <div key={index}>
              {week.map((date: moment.Moment) => (
                <CalendarDate
                  key={date.date()}
                  dateToRender={date}
                  dateOfMonth={this.state.calendar?.currentDate}
                  onClick={(date: moment.Moment) =>
                    alert(
                      `Will go to daily-view of ${date.format('YYYY-MM-DD')}`
                    )
                  }
                />
              ))}
            </div>
          )
        )}
      </div>
    );
  }
}

class YearView extends React.Component<CalendarProps> {
  static range: (date: Date) => moment.Moment[];
  static navigate: (newDate: Date, newView: View) => Date;
  static title: (
    date: Date,
    { localizer }: { localizer: DateLocalizer }
  ) => string;

  render() {
    const { date } = this.props;
    const months = [];

    for (let i = 0; i < 6; i++) {
      months.push(
        <Calendar
          key={i + 1}
          date={moment(date).add(i, 'month').toDate()}
          localizer={localizer}
        />
      );
    }

    return <div className="year">{months.map((month) => month)}</div>;
  }
}
YearView.range = (date: Date) => {
  return [moment(date).startOf('year')];
};

YearView.navigate = (newDate: Date, newView: View) => {
  switch (newView) {
    case navigate.PREVIOUS:
      return moment(newDate).subtract(6, 'M').toDate();

    case navigate.NEXT:
      return moment(newDate).add(6, 'M').toDate();

    default:
      return newDate;
  }
};

YearView.title = (date: Date, { localizer }) => {
  const firstOfMonth = moment(date).startOf('month').toDate();
  const endOfPeriod = moment(firstOfMonth).add(6, 'months').toDate();
  const lastDayOfMonth = moment(endOfPeriod).endOf('month').toDate();

  return `${localizer.format(
    firstOfMonth,
    'monthHeaderFormat',
    ''
  )} - ${localizer.format(lastDayOfMonth, 'monthHeaderFormat', '')}`;
};

export default YearView;
