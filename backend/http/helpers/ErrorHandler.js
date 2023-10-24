class ErrorHandler extends Error {
  constructor(statusCode, errors) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const handleError = (err, req, res) => {
  const { statusCode, errors } = err;

  req.logger.error(err);

  if (!(err && statusCode && errors)) {
    return res.status(500).json({
      errors: [{ message: "An error occurred. Please try again later." }],
    });
  }

  return res.status(statusCode).json(errors);
};

module.exports = {
  ErrorHandler,
  handleError,
};
