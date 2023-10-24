const db = require('../../../lib/knexConnection');
const { DONOR, ENROLLEE } = require('../../../constants/roles');
const { getEndDate, getSubscriptionBalance } = require('../../../lib/helpers/adoptions');

exports.me = async (req, res, next) => {
  try {
    const { activeRole, user } = req;
    let table = 'users';

    switch (activeRole.name) {
      case ENROLLEE.name:
        table = 'vw_enrollees';
        break;
      case DONOR.name:
        table = 'vw_donors';
        break;
      default:
        table = 'users';
        break;
    }

    if (user.roles === '["DONOR"]') table = 'vw_donors';
    let data = await db(table).where({ id: req.user.id }).first();
    if (table === 'users') {
      const { password, ...remaining } = data;
      data = remaining;
    }

    if (activeRole === DONOR.name) {
      const subscription = await db('adoption_requests')
        .where({ userId: user.id, paymentProcessed: 'success' })
        .orderBy('createdAt', 'desc')
        .first(); console.log(user.id);
      data.subscription = getSubscriptionData(subscription);
    }

    if (table === 'vw_enrollees') {
      const sql = `select b.id as "planId",b.type,sum(amount) from wallet a join adoption_rates b on a."planId" = b.id 
     where a."userId"= ${req.user.id}
     group by b.id,b.type;`;
      const wallet = await db.raw(sql);
      data.balances = wallet.rows;
    }

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionData = (subscription) => {
  if (!subscription) {
    return null;
  }

  const { startDate } = subscription;
  const endDate = getEndDate(subscription);

  return {
    startDate,
    endDate,
    balanceInDays: getSubscriptionBalance(endDate),
  };
};
