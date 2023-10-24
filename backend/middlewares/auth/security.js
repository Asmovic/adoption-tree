const errors = require("./errors");

/**
 *
 * @param {string | string[]} roleToCompare
 */
const hasRole = (roleToCompare) => {
  return async (req, res, next) => {
    const { user } = req;
    if (!Array.isArray(roleToCompare)) {
      roleToCompare = [roleToCompare];
    }
    if (user && roleToCompare.includes(user.activeRole)) return next();

    return res.status(403).json({
      code: 56,
      errors: [{ message: errors.ACCESS_DENIED }],
    });
  };
};

module.exports = { hasRole };
