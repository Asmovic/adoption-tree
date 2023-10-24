const moment = require('moment');
const { durationTypes } = require('../../constants/adoptionRequests');

exports.getEndDate = (adoption) => {
  const { startDate, durationType } = adoption;

  switch (durationType) {
    case durationTypes.daily:
      return moment(startDate).add(1, 'day');
    case durationTypes.weekly:
      return moment(startDate).add(1, 'week');
    case durationTypes.monthly:
      return moment(startDate).add(1, 'month');
    case durationTypes.onetime:
      return moment(startDate).add(1, 'year');
    default:
      return startDate;
  }
};

exports.getDurationLabel = (durationType, duration) => {
  switch (durationType) {
    case durationTypes.daily:
      return `${duration} day(s)`;
    case durationTypes.weekly:
      return `${duration} week(s)`;
    case durationTypes.monthly:
      return `${duration} month(s)`;
    case durationTypes.onetime:
      return '1 year';
    default:
      return '';
  }
};

exports.getSubscriptionBalance = (endDate) => {
  const days = moment(endDate).diff(moment(), 'days');

  return days > 0 ? days : 0;
};
