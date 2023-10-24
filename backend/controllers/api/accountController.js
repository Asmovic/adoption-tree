const registrationService = require('../../services/RegistrationService');
const { sendEmail } = require('./../../mail/EmailManager');
const sessionService = require('../../services/SessionService');
const smsService = require('../../services/SmsService');
const { ENTITY_NOT_FOUND,
  RECORD_EXPIRED } = require('./../../constants/errors');
const { generatePassword } = require('./../../lib/auth/security');
const registrationSchema = require('./../../schemas/account/register');
const registrationValidation = require('../../http/helpers/validations/registrationValidation');
const confirmSchema = require('./../../schemas/account/confirm');
const joiValidation = require('./../../lib/helpers/joiValidation');
const { roles } = require('../../constants');
const moment = require('moment');
const db = require('../../lib/knexConnection');
const { stateId } = require('./../../config/appConfig');
const randomize = require('randomatic');

/**
 * Route handler for account registration
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
const registration = async (req, res) => {
  // TODO: Validate uniqueness of phone, email and username
  try {
    console.log('Body: ', req.body);
    const { value: body, error } = await registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json(joiValidation(error));
    }

    await registrationValidation(req.body);

    const {
      firstName, email, phone, password, birthDate,
    } = body;
    delete body.confirmPassword;

    if (birthDate) {
      body.birthDate = moment(birthDate).format('YYYY-MM-DD');
    }

    const user = Object.assign(body, {
      password: await generatePassword(password),
    });

    if (user.role === roles.ENROLLEE) {
      user.stateId = parseInt(process.env.STATE_ID);
    }

    // User should be confirmed if request is coming from ussd
    const authPhone = req.headers['x-phone'];

    if (authPhone && authPhone !== phone) {
      return res.status(400).json({ message: 'Phone number in header is different form the one in body request' });
    }

    const { activationCode,
      continuationToken } = await registrationService.addUser(user, authPhone);

    if (!continuationToken) {
      res.status(201).json({
        success: true,
      });
    }

    // Send activation messages
    smsService.sendActivationMessage(phone, activationCode);
    sendEmail(email, 'Activate your account.', 'activateAccount', {
      firstName,
      activationCode,
    });

    res.status(201).json({
      success: true,
      data: { continuationToken },
    });
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ type: 'validation', errors: error.errors });
    }
    req.logger.error(error);
    res.status(500).json({
      errors: [{ message: 'An error occurred. Please try again later.' }],
    });
  }
};

/**
 * Route handler for account registration confirmation
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
const confirmRegistration = async (req, res) => {
  const { value: body, error } = await confirmSchema.validate(req.body);
  if (error) {
    return res.status(400).json(joiValidation(error));
  }
  const { continuationToken, activationCode } = body;
  try {
    const user = await registrationService.confirmRegistration(
      continuationToken,
      activationCode,
    );

    const roles = JSON.parse(user.roles);
    user.activeRole = roles[0];

    const { accessToken,
      refreshToken,
      user: loggedInUser } = await sessionService.createSession(user, req);

    res.set('X-Refresh-Token', refreshToken);
    res.set('X-Access-Token', accessToken);

    const registrationCode = randomize('A', 3) + randomize('0', 6);
    await db('users').where({ id: user.id }).update({ registrationCode });

    return res.json({
      success: true,
      data: { user: loggedInUser },
      appStateId: parseInt(stateId),
    });
  } catch (error) {
    if ([ENTITY_NOT_FOUND, RECORD_EXPIRED].includes(error.message)) {
      return res.status(400).json({
        errors: [
          {
            message: 'Sorry, this code has expired or is invalid.',
          },
        ],
      });
    }

    req.logger.error(error);
    res.status(500).json({
      errors: [{ message: 'An error occurred. Please try again later.' }],
    });
  }
};

module.exports = { registration, confirmRegistration };
