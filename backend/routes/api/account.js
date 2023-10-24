const router = require('express').Router();
const verifyPhone = require('../../middlewares/lib');
const { handleError } = require('../../http/helpers/ErrorHandler');
const { registration,
  confirmRegistration } = require('../../controllers/api/accountController');
const { forgotPassword, resetPassword, resendOtp } = require('../../http/controllers/auth/PasswordController');
const { registrationData } = require('../../http/controllers/auth/registrationController');

router.get('/registration-data', registrationData);
router.post('/register', verifyPhone, registration);
router.post('/confirm-registration', confirmRegistration);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOtp);
router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
