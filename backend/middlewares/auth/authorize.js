const sessionService = require('./../../services/SessionService');
const { decodeJWTToken } = require('./../../lib/helpers/jwt');
const errors = require('./errors.js');
const logger = require('./../../lib/logger');
const bcrypt = require('bcrypt');
const authService = require('../../services/AuthService');
const roles = require('./../../constants/roles');

const apiKeys = require('./apikey.js');

const getAuthToken = (headers) => {
  if (!(headers && headers.authorization)) {
    return false;
  }

  const token = headers.authorization;
  const parts = token.split(' ');
  if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer') return false;
  const jwtToken = parts[1];
  return jwtToken;
};

const getRefreshToken = (headers) => {
  if (!headers) {
    return false;
  }

  return headers['x-refresh-token'];
};

const getHeaders = (req) => req.headers;

const authorize = async (req, res, next) => {
  const headers = getHeaders(req);
  let JWTToken = getAuthToken(headers);
  const keyId = headers['x-api-key'];
  const phoneNo = headers['x-phone'];

  if (keyId) {
    for (const [key] of apiKeys.entries()) {
      const isValid = await bcrypt.compare(key, keyId);
      if (isValid) {
        const user = await authService.GetUser(null, phoneNo);
        if (user) {
          req.user = user;
          req.activeRole = roles.ENROLLEE;// TODO - GET ACTIVE ROLE SOMEHOW
          return next();
        }
      }
    }
  }

  if (!JWTToken) {
    return res.status(401).json({
      code: 44,
      errors: [
        {
          message: errors.AUTH_HEADERS_MISSING,
        },
      ],
    });
  }

  let refreshToken = getRefreshToken(headers);
  if (!refreshToken) {
    return res.status(401).json({
      code: 44,
      errors: [
        {
          message: errors.REFRESH_TOKEN_MISSING,
        },
      ],
    });
  }

  let user = null;

  try {
    user = await decodeJWTToken(JWTToken, true);
  } catch (error) {
    if (error.name !== 'TokenExpiredError') {
      return res.status(401).json({
        code: 52,
        errors: [
          {
            message: errors.INVALID_TOKEN,
          },
        ],
      });
    }

    const { expiredAt } = error;
    const date = Date.now() / 1000;

    // if token expired up to `SESSION_LIFETIME` minutes
    // ago (defaults to 30 minutes), end session
    const appSessionExpiryTime =
      expiredAt.getTime() / 1000 +
      parseInt(process.env.SESSION_LIFETIME || 30) * 60;

    if (date >= appSessionExpiryTime) {
      res.set('X-Kill-Session', true);
      return res.status(401).json({
        errors: [
          {
            message: errors.SESSION_EXPIRED,
          },
        ],
      });
    }

    // Else refresh token
    try {
      const result = await sessionService.refreshAuthTokens(
        JWTToken,
        refreshToken,
      );
      user = result.user;
      JWTToken = result.accessToken;
      refreshToken = result.refreshToken;
      res.set({
        'X-Access-Token': JWTToken,
        'X-Refresh-Token': refreshToken,
      });
    } catch (error) {
      logger.error(error);
      if (error.code && error.code === 'SESSION_NOT_FOUND') {
        // Add kill-switch header.
        // This header instructs the front-end application
        // to destroy it's current session.
        res.set('X-Kill-Session', true);
        return res.status(401).json({
          errors: [
            {
              message: errors.SESSION_NOT_FOUND,
            },
          ],
        });
      }
      return res.status(500).json('An error occurred. Please try again later.');
    }
  }

  req.accessToken = JWTToken;
  req.refreshToken = refreshToken;
  req.user = user;
  req.activeRole = user.activeRole;

  return next();
};

module.exports = authorize;
