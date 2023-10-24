const express = require('express');
const router = express.Router();
const { roles,
  redis } = require('../../../constants');
const { keyPrefixes: redisKeyPrefixes } = redis;
const { generateRedisKey } = require('../../../lib/helpers/redis');
const authService = require('../../../services/AuthService');
const sessionService = require('../../../services/SessionService');
const redisClient = require('./../../../lib/redisClient');
const { ENTITY_NOT_FOUND } = require('./../../../constants/errors');
const loginSchema = require('./../../../schemas/auth/login');
const joiValidation = require('./../../../lib/helpers/joiValidation');
const { ENROLLEE } = require('../../../constants/roles');
const db = require('../../../lib/knexConnection');
const { stateId } = require('./../../../config/appConfig');

router.post('/', async function (req, res) {
  // TODO: Confirm if username can be interchanged with phone number
  const { value: body,
    error } = await loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json(joiValidation(error));
  }
  const { username,
    phone,
    password } = body;

  try {
    const _user = await authService.LogInUser(username, phone, password);

    let { roles: userRoles,
      ...userData } = _user;
    console.log('User Data===>:', userData);
    if (userRoles) {
      userRoles = JSON.parse(userRoles);
    }

    if (userRoles.length === 1) {
      // Set role as active
      userData.activeRole = userRoles[0];
    }

    if (userData.activeRole === ENROLLEE.name) {
      const enrollee = await db('enrollees').where({ userId: userData.id }).first();
      userData.enrolleeId = enrollee.id;
      userData.biometricId = enrollee.biometricId;
    }

    const { accessToken,
      refreshToken,
      user } = await sessionService.createSession(userData, req);
    res.set('X-Refresh-Token', refreshToken);
    res.set('X-Access-Token', accessToken);

    let responseData = {
      success: true,
      user,
      appStateId: parseInt(stateId),
    };

    if (userRoles.length > 1) {
      // Create a pending session request
      const redisKey = generateRedisKey(redisKeyPrefixes.PENDING_LOGIN)(
        username,
        refreshToken,
      );

      redisClient.set(redisKey, user.id);
      responseData = Object.assign(responseData, {
        success: false,
        roleOptions: userRoles.reduce((acc, entry) => {
          const role = Object.keys(roles).find((x) => roles[x].name === entry);
          if (role) acc.push(roles[role]);
          return acc;
        }, []),
      });
    }
    return res.json(responseData);
  } catch (error) {
    // Catch user not found error
    if (error.message === ENTITY_NOT_FOUND) {
      return res.status(401).json({
        errors: [{
          message: 'The user with your username/password does not exist.',
        }],
      });
    }
    req.logger.error(error);
    res.status(500).json('An error occurred. Please try again later.');
  }
});

module.exports = router;
