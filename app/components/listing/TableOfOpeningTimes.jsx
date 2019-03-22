import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { RelativeOpeningTime } from './RelativeOpeningTime';
import { sortScheduleDays } from '../../utils';

export class TableOfOpeningTimes extends React.Component {
  static getScheduleTimestamp(sched) {
    const opens_at = moment(RelativeOpeningTime.parseAsDate(sched.opens_at));
    const closes_at = moment(RelativeOpeningTime.parseAsDate(sched.closes_at));
    return {
      opens_at: opens_at.format('h:mma'),
      closes_at: closes_at.format('h:mma'),
    };
  }

  render() {
    const { schedule } = this.props;

    // TODO order with current day first
    // TODO Show relativeOpeningTime for current day
    // TODO Show days without entries in the schedule as closed
    // TODO Order with current day at top

    return (
      <table className="compact">
        <tbody>
          { sortScheduleDays(schedule.schedule_days).map(sched => {
            const { opens_at, closes_at } = TableOfOpeningTimes.getScheduleTimestamp(sched);
            return (
              <tr key={sched.id}>
                <th>{ sched.day }</th>
                <td>
                  { opens_at }
                  {' '}
-
                  {' '}
                  { closes_at }
                </td>
              </tr>
            );
          }) }
        </tbody>
      </table>
    );
  }
}

TableOfOpeningTimes.propTypes = {
  schedule: PropTypes.object,
};

TableOfOpeningTimes.defaultProps = {
  schedule: {},
};
