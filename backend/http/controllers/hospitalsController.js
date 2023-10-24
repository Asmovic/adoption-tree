const db = require('../../lib/knexConnection');
const _ = require('lodash');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const moment = require('moment');
const { validateCreate } = require('../../schemas/hospitals/saveHospitalSchema');
const { validateUpdate } = require('../../schemas/hospitals/updateHospitalSchema');
const { downloadData } = require('../helpers/dataExport');

const {
  HOSPITALS,
  PATIENT_CHECKINS,
  USERS,
  DOCTORS,
  HOSPITAL_DEPARTMENTS,
} = require('../../config/dbConfig').tableNames;

// Get hospitals
exports.index = async (req, res, next) => {
  try {
    const hospitals = await db(HOSPITALS)
      .paginate(db.setPaginateOptions(req.query));
    return res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
};

// Save new hospital
exports.store = async (req, res, next) => {
  try {
    var body = _.pick(req.body, ['lgaId', 'name', 'erpId']);

    const { isValid, errors } = await validateCreate(body);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    const [hospital] = await db(HOSPITALS).insert(body, '*');

    return res.json({ data: hospital });
  } catch (error) {
    next(error);
  }
};

// Update hospital
exports.update = async (req, res, next) => {
  try {
    const { params, body } = req;

    var existingHospital = await db(HOSPITALS)
      .where({ id: params.id })
      .first();

    if (!existingHospital) {
      throw new ErrorHandler(404, [{ message: 'Hospital specified does not exist' }]);
    }

    const payload = _.pick(body, ['lgaId', 'name', 'erpId', 'isActive']);

    const { isValid, errors } = await validateUpdate(existingHospital, payload);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };

    payload.updatedAt = moment().format('YYYY-MM-DD hh:mm:ss');

    const [hospital] = await db(HOSPITALS)
      .where({ id: params.id })
      .update(payload, '*');

    return res.json({ data: hospital });
  } catch (error) {
    next(error);
  }
};

// Get patient check-ins
exports.checkins = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      doctorId,
      departmentId,
      hospitalId,
      startDate,
      endDate,
      download = 'false',
    } = req.query;

    const { data, pagination } =
      await db.select({
        p: 'pc.*',
        hospital: 'h.name',
        department: 'hd.name',
        patient: db.raw('CONCAT(u."firstName", \' \', u."lastName")'),
        doctor: db.raw('CONCAT(us."firstName", \' \', us."lastName")'),
      })
        .from({ pc: PATIENT_CHECKINS })
        .innerJoin({ u: USERS }, 'pc.userId', '=', 'u.id')
        .leftOuterJoin({ h: HOSPITALS }, 'pc.hospitalId', '=', 'h.id')
        .leftOuterJoin({ hd: HOSPITAL_DEPARTMENTS }, 'pc.departmentId', '=', 'hd.id')
        .leftOuterJoin({ d: DOCTORS }, 'pc.doctorId', '=', 'd.id')
        .leftJoin({ us: USERS }, 'd.userId', '=', 'us.id')
        .modify(function (queryBuilder) {
          if (doctorId) {
            queryBuilder.where('pc.doctorId', '=', doctorId);
          }
          if (departmentId) {
            queryBuilder.where('pc.departmentId', '=', departmentId);
          }
          if (hospitalId) {
            queryBuilder.where('pc.hospitalId', '=', hospitalId);
          }
        })
        .dateFilter('pc.createdAt', startDate, endDate)
        .orderBy('pc.createdAt', 'desc')
        .paginate({ perPage, currentPage: page });

    if (download === 'true') {
      const fields = getCheckinExportFields();
      return downloadData(res, 'checkins.csv', fields, data);
    }

    return res.json({ data, pagination });
  } catch (error) {
    next(error);
  }
};

const getCheckinExportFields = () => {
  return [
    { label: 'Date', value: 'createdAt' },
    { label: 'Patient', value: 'user' },
    { label: 'Department', value: 'department' },
    { label: 'Hospital', value: 'hospital' },
  ];
};
