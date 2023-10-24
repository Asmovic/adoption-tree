const roles = require("./../../constants/roles");

exports.roleKeys = Object.keys(roles).reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {});
