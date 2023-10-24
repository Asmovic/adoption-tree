const db = require('../../../lib/knexConnection');
const { sendEmail } = require('../../../mail/EmailManager');
const smsService = require('./../../../services/SmsService');
const { generateRandomNumber,
  generateRandomString } = require('../../../lib/utils');
const { generatePassword } = require('../../../lib/auth/security');
const { formatPhoneNumber } = require('../../../lib/utils');
const { findConfirmationEntryByContinuation } = require('../../../repositories/RegistrationRepository');

exports.forgotPassword = async (req, res) => {
  try {
    const phone = req.body.phone || '';
    const username = req.body.username || '';

    if (!(phone || username)) {
      return res.status(500).json({
        errors: [
          {
            message: 'No username or phone number specified',
          },
        ],
      });
    }

    const user = await db('users')
      .where({ phone })
      // .orWhere({ phone: formatPhoneNumber(phone) })
      .orWhere({ username })
      .first();

    let continuationToken;

    if (user) {
      const token = generateRandomNumber(6);
      continuationToken = generateRandomString(64);
      await db('password_resets').insert({
        username: user.username,
        phone: user.phone,
        token,
        continuationToken,
      });
      sendEmail(user.email, 'Reset Password Notification', 'forgotPassword', {
        token,
      });
      smsService.sendResetMessage(user.phone, token);
    }

    return res.json({
      continuationToken,
      message:
        'If you have a record with us, you will receive an email notification shortly',
    });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      errors: [
        {
          message: 'A server error occurred. Please try again later.',
        },
      ],
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const {
      password, confirmPassword, token, continuationToken,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        type: 'validation',
        errors: [
          {
            key: 'password',
            message: 'Password must have a value',
          },
        ],
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        type: 'validation',
        errors: [
          {
            key: 'confirmPassword',
            message: "Password and Passowrd confirm don't match",
          },
        ],
      });
    }

    if (!(token && continuationToken)) {
      return res.status(400).json({
        errors: [
          {
            message: 'Invalid data', // Don't give away security info
          },
        ],
      });
    }

    const check = await db('password_resets')
      .where({ continuationToken, token: token.toUpperCase() })
      .orderBy('createdAt', 'desc')
      .first();

    if (!check) {
      res.status(400).json({
        errors: [
          {
            message: 'Reset token is either expired or invalid',
          },
        ],
      });
    }

    const newPassword = await generatePassword(password);
    const { username, phone } = check;

    await db.transaction(async (trx) => {
      await db('users')
        .where({ phone })
        .orWhere({ username })
        .update({ password: newPassword })
        .transacting(trx);

      await db('password_resets')
        .where({ token, continuationToken })
        .del()
        .transacting(trx);
    });

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      errors: [
        {
          message: 'A server error occurred. Please try again later.',
        },
      ],
    });
  }
};

exports.resendOtp = async (req, res) => {
  const phone = req.body.phone || '';
  const username = req.body.username || '';
  const continuationToken = req.body.continuationToken;
  try {
    if (!continuationToken) {
      return res.status(500).json({
        errors: [
          {
            message: 'No continuatoken token specified',
          },
        ],
      });
    }
    if (!(phone || username)) {
      return res.status(500).json({
        errors: [
          {
            message: 'No username or phone number specified',
          },
        ],
      });
    }

    const user = await db('users')
      .where({ phone })
      .orWhere({ phone: formatPhoneNumber(phone) })
      .orWhere({ username })
      .first();

    if (user) {
      console.log('User found', user);
      const token = generateRandomNumber(6);
      const priorToken = await db('account_verification').where({ continuationToken, userId: user.id }).first();
      console.log('continuationToken ==>: ', priorToken);
      if (priorToken) {
        console.log('continuation token found');
        await db('account_verification').where({
          userId: user.id,
          continuationToken,
        }).update({
          activationCode: token,
        });
      } else {
        console.log('Here Here Here');
        await db('account_verification').insert({
          userId: user.id,
          userRole: user.roles[0],
          activationCode: token,
          continuationToken: continuationToken,
        });
      }

      sendEmail(user.email, 'User activation', 'activateAccount', {
        token,
        firstName: user.firstName,
        activationCode: token,
      });
      smsService.sendResetMessage(user.phone, token);
      return res.json({
        continuationToken,
        message:
        'If you have a record with us, you will receive an email notification shortly',
      });
    } else {
      return res.status(500).json({
        errors: [
          {
            message: 'User not found',
          },
        ],
      });
    }
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      errors: [
        {
          message: 'A server error occurred. Please try again later.',
        },
      ],
    });
  }
};
