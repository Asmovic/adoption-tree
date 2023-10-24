const moment = require('moment');
const db = require('../lib/knexConnection');
const { getEndDate } = require('../lib/helpers/adoptions');
const {
  // ADOPTIONS,
  ADOPTION_REQUESTS,
  // ENROLLEES,
  USERS } = require('../config/dbConfig').tableNames;
// const newAdoptionNotification = require('../notifications/newAdoptionNotification');

exports.run = async () => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const sql = `SELECT a.*,b.phone
      FROM ${ADOPTION_REQUESTS} a join ${USERS} b on a."userId" = b.id
      WHERE a."paymentProcessed" = 'success'
      AND  (a."noOfAdoptedPersons" < a."noOfAdoptees" OR a."noOfAdoptedPersons" IS NULL)
      AND a."startDate" <= '${today}';`;
    // Get requests
    const result = await db.raw(sql);
    const requests = result.rows;

    for (let index = 0; index < requests.length; index++) {
      try {
        const request = requests[index];
        if (request.category === 'self') {
          await processSelfAdoption(request);
          // todo - send self sms using phonr
        } else {
          // fulfill donation
        }
      } catch (error) {

      }
    }
  } catch (error) {
    console.error('ADOPTION_TASK', error);
  }
};

const processSelfAdoption = async (request) => {
  const { id: requestId,
    durationType,
    userId } = request;
  const sql = `CALL process_self_adoption(${requestId},${userId},'${durationType}')`;
  await db.raw(sql);
};

/*
const processAdoption = async (request) => {
  try {
    const {
      id: requestId,
      durationType,
      noOfAdoptedPersons,
      lgaId,
    } = request;

    let sql = `SELECT u.id "enrolleeId", u.phone
      FROM ${ENROLLEES} e
      JOIN ${USERS} u
      ON e."userId" = u.id
      LEFT JOIN ${ADOPTIONS} a
      ON e.id = a."adopteeId"
      WHERE a.id IS NULL`;

    if (lgaId) {
      sql += ` AND u."lgaId" = ${lgaId}`;
    }

    const result = await db.raw(sql);
    const enrollees = result.rows;

    console.log('sql: ', sql);
    console.log('enrollees: ', enrollees);

    for (let i = 0; i < enrollees.length; i++) {
      try {
        const enrollee = enrollees[i];
        const startDate = moment().format('YYYY-MM-DD');
        const endDate = getEndDate({ startDate, durationType });

        await db(ADOPTIONS)
          .insert({
            adoptionRequestId: requestId,
            adopteeId: enrollee.enrolleeId,
            startDate,
            endDate,
            completed: false,
          });

        const newCount = noOfAdoptedPersons ? noOfAdoptedPersons + 1 : 1;

        await db(ADOPTION_REQUESTS)
          .where({ id: requestId })
          .update({
            noOfAdoptedPersons: newCount,
          });

        newAdoptionNotification.toSms(enrollee.phone, request);
      } catch (err) {
        console.error('PROCESS_ADOPTION INNER', err);
      }
    }
  } catch (error) {
    console.error('PROCESS_ADOPTION', error);
  }
};
*/
