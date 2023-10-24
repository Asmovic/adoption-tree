const express = require('express');
const router = express.Router();

const { generateRedisKey } = require('./../../../lib/helpers/redis');
const redisClient = require('./../../../lib/redisClient');
const authorize = require('./../../../middlewares/auth/authorize');
const { keyPrefixes } = require('./../../../constants/redis');

const sessionService = require('./../../../services/SessionService');
const activeRoleSchema = require('./../../../schemas/auth/activeRole');

const { me } = require('../../../http/controllers/auth/userController');

router.use('/login', require('./login'));
router.use('/reset-password', async (req, res) => {
  //
});

router.patch('/active-role', authorize, async (req, res) => {
  // TODO: Add logic to update/set current user's active role
  const { refreshToken, user } = req;

  try {
    // Validate request
    const { value: body, error } = await activeRoleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: error.details.map((error) => {
          return { message: error.message, key: error.context.key };
        }),
      });
    }

    const { activeRole } = body;

    // Get pending session request
    const redisKey = generateRedisKey(keyPrefixes.PENDING_LOGIN)(
      user.username,
      refreshToken,
    );
    const userId = await redisClient.get(redisKey);
    if (!userId) {
      return res.status(401).json({
        errors: [{ message: 'Pending session not found.' }],
      });
    }

    const updated = await sessionService.updateSessionByUserIdAndRefreshToken(
      { activeRole },
      user.id,
      refreshToken,
    );
    if (!updated) {
      return res.status(401).json({
        errors: [{ message: 'Session not found.' }],
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json('An error occurred. Please try again later.');
  }
});

router.use('/logout', authorize, require('./logout'));

router.get('/me', authorize, me);

module.exports = router;
