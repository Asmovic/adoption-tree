const db = require('../../lib/knexConnection');
const moment = require('moment');
const { tableNames } = require('../../config/dbConfig');
const {
  ADOPTION_REQUESTS, VW_ADOPTION_RANKING, ADOPTIONS, PATIENT_CHECKINS,
} = tableNames;

exports.donorData = async (req, res, next) => {
  try {
    const { user } = req;
    const monthStartDate = moment().startOf('month').format('YYYY-MM-DD hh:mm');

    const [
      adoptees,
      newAdoptees,
      lgaImpact,
      totalDonation,
      currentRank,
    ] = await Promise.all([
      db(ADOPTION_REQUESTS).where('userId', '=', user.id)
        .andWhere('type', '!=', 'self')
        .andWhere('paymentProcessed', '=', 'success')
        .sum('noOfAdoptees'),

      db(ADOPTION_REQUESTS)
        .where('userId', '=', user.id)
        .andWhere('createdAt', '>=', monthStartDate)
        .andWhere('type', '!=', 'self')
        .andWhere('paymentProcessed', '=', 'success')
        .sum('noOfAdoptees'),

      db(ADOPTION_REQUESTS)
        .where('userId', '=', user.id)
        .andWhere('type', '!=', 'self')
        .andWhere('paymentProcessed', '=', 'success')
        .countDistinct('lgaId'),

      db(ADOPTION_REQUESTS)
        .where('userId', '=', user.id)
        .andWhere('type', '!=', 'self')
        .andWhere('paymentProcessed', '=', 'success')
        .sum('totalAmount'),

      db(VW_ADOPTION_RANKING)
        .where('userId', '=', user.id),
    ]);

    return res.json({
      data: {
        adoptees: adoptees[0].sum || 0,
        newAdoptees: newAdoptees[0].sum || 0,
        lgaImpact: lgaImpact[0].count || 0,
        totalDonation: totalDonation[0].sum || 0,
        currentRank: (currentRank[0] || {}).rank || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.adopteeDashboardData = async (req, res, next) => {
  const { user } = req;
  const dashboardData = {
    daysLeft: 0, weeksLeft: 0, hospitalVisits: 0,
  };

  try {
    const latestAdoption = await db.select().from(ADOPTIONS).where({ adopteeId: user.id }).orderBy('endDate', 'desc').first();
    if (latestAdoption) {
      const today = moment();
      const endDate = moment(latestAdoption.endDate);
      const monthStartDate = moment().startOf('month').format('YYYY-MM-DD hh:mm');
      dashboardData.daysLeft = endDate.diff(today, 'days');
      dashboardData.weeksLeft = endDate.diff(today, 'weeks');
      const hospitalVisits = await db.select().from(PATIENT_CHECKINS).where({ userId: user.id }).andWhere('createdAt', '>=', monthStartDate).count().first();
      dashboardData.hospitalVisits = (hospitalVisits || {}).count || 0;
    }

    return res.json({
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};
