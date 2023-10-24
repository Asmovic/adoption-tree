module.exports = async (req, res, next) => {
  const baseUrl = req.protocol + '://' + req.headers.host;
  const hostname = req.hostname;
  req.baseUrl = baseUrl;
  process.env.APP_BASE_URL = baseUrl;
  process.env.HOSTNAME = hostname;
  process.env.EXTERNAL_BASE_URL = req.protocol + '://' + hostname;
  next();
};
