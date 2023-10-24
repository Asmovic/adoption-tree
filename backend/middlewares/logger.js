const logger = require('./../lib/logger');

module.exports = (req, _res, next) => {
  req.logger = logger;
  next();
};
