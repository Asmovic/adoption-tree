const jwt = require("jsonwebtoken");
const util = require("util");

jwt.verify = util.promisify(jwt.verify);
jwt.sign = util.promisify(jwt.sign);
jwt.decode = util.promisify(jwt.decode);

module.exports = {
  async generateJWTToken(claims, expires) {
    expires = expires || process.env.TOKEN_EXPIRY;
    return jwt.sign(claims, process.env.JWT_SECRET, {
      expiresIn: expires,
    });
  },
  async decodeJWTToken(token, verifyExpiry = false) {
    return jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: !verifyExpiry,
    });
  },
};
