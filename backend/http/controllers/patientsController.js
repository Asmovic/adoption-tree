const db = require('../../lib/knexConnection');
const { VW_PATIENTS, PATIENT_CHECKINS } = require('../../config/dbConfig').tableNames;
const _ = require('lodash');

exports.getPatients = async (req, res, next) => {
  try {
    const {
      phone, biometricId, perPage, page,
    } = req.query;

    const patients = await db(VW_PATIENTS)
      .modify(function (queryBuilder) {
        if (phone) {
          queryBuilder.where({ phone });
        }
        if (biometricId) {
          queryBuilder.where({ biometricId });
        }
      })
      .paginate({ perPage: perPage || 25, currentPage: page || 1 });

    return res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};

exports.checkin = async (req, res, next) => {
  try {
    const { body, user } = req;
    console.log('user:', user);
    const data = _.pick(body, ['note', 'hospitalId', 'departmentId', 'userId']);
    data.doctorId = user.id;

    const [checkin] = await db(PATIENT_CHECKINS)
      .insert(data, '*');

    return res.json({ success: true, data: checkin });
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const patient = await db(VW_PATIENTS)
      .where({ id })
      .first();

    return res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.getPatientCheckins = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { perPage, page } = req.query;

    const checkins = await db(PATIENT_CHECKINS)
      .where({ userId: id })
      .paginate({ perPage: perPage || 25, currentPage: page || 1 });

    return res.json({ success: true, data: checkins });
  } catch (error) {
    next(error);
  }
};
