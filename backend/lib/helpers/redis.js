const { keyPrefixes } = require("./../../constants/redis");

module.exports = {
  generateRedisKey: (prefix) => {
    switch (prefix) {
      case keyPrefixes.PENDING_LOGIN:
        return (username, refreshToken) => {
          return `${prefix}:${username}:${refreshToken}`;
        };
      default:
        return () => "";
    }
  },
};
