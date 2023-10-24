const moment = require('moment');
const { sendEmail } = require('../mail/EmailManager');
const { durationTypes, categories } = require('../constants/adoptionRequests');

exports.toMail = async (user, adoption) => {
    const data = {
        user,
        type: adoption.type,
        count: adoption.noOfAdoptees,
        amount: adoption.totalAmount,
        startDate: moment(adoption.startDate).format('Do MMM, YYYY'),
        endDate: getEndDate(adoption).format('Do MMM, YYYY'),
        platform: process.env.APP_PLATFORM,
    };

    if (adoption.category === categories.self) {
        await sendEmail(user.email, 'New Plan Purchase', 'adoption/planPurchase', data);
    } else {
        await sendEmail(user.email, 'New Adoption', 'adoption/newAdoption', data);
    }
};

const getEndDate = (adoption) => {
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
