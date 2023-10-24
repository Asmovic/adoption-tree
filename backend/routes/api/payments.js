const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');

const {
  index, validatePayment, savePayment, voucherPayment,
} = require('../../http/controllers/PaymentController');

router.get('/', authorize, index);

router.post('/', authorize, savePayment);

router.post('/validate', validatePayment);

router.post('/voucher', authorize, voucherPayment);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
