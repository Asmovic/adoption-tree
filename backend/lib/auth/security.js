const bcrypt = require("bcrypt");

const generatePassword = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const comparePassword = async (password, hash) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    return false;
  }
};

// const permissions = {
//   RESET_USER_PASSWORD: 'reset_user_password'
// }

module.exports = {
  comparePassword,
  generatePassword,
  // hasPermission,
  // permissions
};
