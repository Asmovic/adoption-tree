const { DOCTORS,
  USERS,
  VW_DOCTORS } = require('../../config/dbConfig').tableNames;
const db = require('../../lib/knexConnection');
const { DOCTOR,
  HOSPITAL_ADMIN } = require('../../constants/roles');
const { generateRandomPassword } = require('../../lib/utils');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { validateSaveDoctorDetails } = require('../../schemas/doctors/saveDoctorDetailsSchema');
const { validateUpdateDoctorDetails } = require('../../schemas/doctors/updateDoctorDetailsSchema');
const { generateResetToken } = require('../../services/PasswordService');
const newDoctorNotification = require('../../notifications/newDoctorNotification');
const _ = require('lodash');

exports.getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await db(VW_DOCTORS)
      .where({
        doctorId: id,
      })
      .first();

    if (!doctor) {
      throw new ErrorHandler(404, [{
        message: 'Doctor info not found',
      }]);
    }

    return res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAll = async (req, res, next) => {
  try {
    const { query } = req;
    const page = query.page || 1;
    const perPage = query.perPage || 25;

    const doctors = await db(VW_DOCTORS)
      .paginate({
        perPage: perPage,
        currentPage: page,
      });

    return res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

exports.saveDetails = async (req, res, next) => {
  try {
    const { user,
      body,
      activeRole } = req;

    const validation = await validateSaveDoctorDetails(body, user, activeRole);
    if (!validation.isValid) {
      throw new ErrorHandler(400, validation.errors);
    };

    const {
      firstName,
      lastName,
      middleName,
      phone,
      email,
      idNumber,
      departmentId,
      gender,
    } = body;

    const password = generateRandomPassword();
    const roles = JSON.stringify([DOCTOR.name]);

    await db.transaction(async trx => {
      const [savedUser] = await trx(USERS)
        .insert({
          firstName,
          lastName,
          middleName,
          phone,
          email,
          username: phone,
          password,
          gender,
          roles,
          hospitalId: user.hospitalId,
          active: true,
        }, '*');

      await trx(DOCTORS)
        .insert({
          idNumber,
          departmentId,
          hospitalId: user.hospitalId,
          userId: savedUser.id,
        });

      const { token } = await generateResetToken(savedUser);
      newDoctorNotification.sendToAll(savedUser, token);
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDetails = async (req, res, next) => {
  try {
    const { value: body,
      isValid,
      errors } = await validateUpdateDoctorDetails(req.body);
    if (!isValid) {
      throw new ErrorHandler(400, errors);
    };
    const { idNumber,
      departmentId,
      ...userData } = body;

    const { id } = req.params;

    const doctor = await db(VW_DOCTORS)
      .where({
        id,
      })
      .first();

    if (!doctor) {
      throw new ErrorHandler(404, [{
        message: 'Doctor info not found',
      }]);
    }

    const doctorData = {};
    if (idNumber) doctorData.idNumber = idNumber;
    if (departmentId) doctorData.departmentId = departmentId;

    await db.transaction(async trx => {
      if (!_.isEmpty(userData)) {
        await trx(USERS)
          .where({
            id: doctor.userId,
          })
          .update(userData);
      }

      if (!_.isEmpty(doctorData)) {
        await trx(DOCTORS)
          .where({
            id,
          })
          .update(doctorData);
      }
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
