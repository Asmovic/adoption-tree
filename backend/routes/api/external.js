const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const { updateBiometric } = require('../../http/controllers/externalController');

router.post('/update-biometric', updateBiometric);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
