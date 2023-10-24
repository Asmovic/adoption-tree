const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');

const { index } = require('../../http/controllers/subscriptionsController');

router.get('/', authorize, index);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
