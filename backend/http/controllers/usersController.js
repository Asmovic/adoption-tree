const db = require('../../lib/knexConnection');
const { validateUpdateUserProfile } = require('../../schemas/account/updateUserProfileSchema');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const {
  USERS,
  DONORS,
  VW_DONORS,
  VW_ENROLLEES,
} = require('../../config/dbConfig').tableNames;
const { DONOR, ENROLLEE } = require('../../constants/roles');
const { validateCreate } = require('../../schemas/users/createAdminSchema');
const { generateRandomPassword } = require('../../lib/utils');
const { generateResetToken } = require('../../services/PasswordService');
const newUserNotification = require('../../notifications/newUserNotification');
const roles = require('./../../constants/roles');

exports.index = async (req, res, next) => {
  try {
    const {
      perPage = 25, page = 1, role, gender, type,
    } = req.query;

    const query = db(USERS);

    if (type === 'admin') {
      query.where('roles', 'like', `%${roles.ADMIN.name}%`)
        .orWhere('roles', 'like', `%${roles.HOSPITAL_ADMIN.name}%`);
    } else {
      query.modify(function (queryBuilder) {
        if (gender) {
          queryBuilder.where({ gender });
        }
        if (role) {
          queryBuilder.where('roles', 'like', `%${role}%`);
        }
      });
    }
    const users = await query.orderBy('createdAt', 'desc')
      .paginate({
        perPage: perPage,
        currentPage: page,
      });

    return res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const user = await db(USERS)
      .where({ id: req.params.id })
      .first();

    return res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const validation = await validateUpdateUserProfile(req.body);
    if (!validation.isValid) throw new ErrorHandler(400, validation.errors);

    const {
      firstName,
      lastName,
      middleName,
      birthDate,
      address,
      nationality,
      stateId,
      lgaId,
      phone,
      officePhone,
      residentAddress,
      residentLgaId,
      residentStateId,
      officeAddress,
      publicProfile,
    } = req.body;

    await db(USERS)
      .where({ id: req.user.id })
      .update({
        firstName,
        lastName,
        middleName,
        birthDate,
        address,
        nationality,
        stateId,
        lgaId,
        phone,
        officePhone,
        officeAddress,
        publicProfile,
      })
      .returning('*');

    if (req.activeRole === DONOR.name) {
      await db(DONORS)
        .where({ userId: req.user.id })
        .update({ residentAddress, residentLgaId, residentStateId });
    }

    const { activeRole } = req;
    let table = USERS;

    switch (activeRole) {
      case ENROLLEE.name:
        table = VW_ENROLLEES;
        break;
      case DONOR.name:
        table = VW_DONORS;
        break;
      default:
        break;
    }

    const data = await db(table).where({ id: req.user.id }).first();

    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.toggleProfileVisibility = async (req, res, next) => {
  try {
    const { user, body } = req;

    await db(USERS)
      .where({ id: user.id })
      .update({ publicProfile: body.status });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { body } = req;
    const validation = await validateCreate(body);
    if (!validation.isValid) {
      throw new ErrorHandler(400, validation.errors);
    };

    const password = generateRandomPassword();
    body.roles = JSON.stringify([body.role]);
    body.password = password;
    body.username = body.phone;
    delete body.role;

    const [savedUser] = await db(USERS)
      .insert(body, '*');

    const { token } = await generateResetToken(savedUser);
    newUserNotification.sendToAll(savedUser, token);

    return res.json({ success: true, data: savedUser });
  } catch (error) {
    next(error);
  }
};
