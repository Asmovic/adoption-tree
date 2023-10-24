const db = require('../../lib/knexConnection');
const { tableNames } = require('../../config/dbConfig');
const { HOSPITAL_DEPARTMENTS, LGAS, HOSPITALS } = tableNames;
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { stateId } = require('./../../config/appConfig');

exports.doctorRegistrationData = async (req, res, next) => {
  const { hospitalId } = req.user;
  try {
    const departments = await db.select().from(HOSPITAL_DEPARTMENTS).where({
      hospitalId,
    });

    return res.json({
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

exports.hospitalDepartmentAdd = async (req, res, next) => {
  try {
    const { user, body } = req;
    const { hospitalId } = user;
    const { name } = body;

    const request = await db(HOSPITAL_DEPARTMENTS)
      .insert({ hospitalId, name })
      .returning('*');
    return res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

exports.fetchLgas = async (req, res, next) => {
  try {
    const { STATE_ID: stateId } = process.env;

    if (!stateId) {
      throw new ErrorHandler(400, [{ message: 'State ID not provided' }]);
    }

    const lgas = await db(LGAS).where({ stateId });

    return res.json({ data: lgas });
  } catch (error) {
    next(error);
  }
};

exports.fetchHospitals = async (req, res, next) => {
  try {
    const { lgaId } = req.query;
    const hospitals = await db(HOSPITALS).where({ lgaId });

    return res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
};

exports.stateId = async (req, res, next) => {
  try {
    return res.json({ data: stateId });
  } catch (error) {
    next(error);
  }
};
