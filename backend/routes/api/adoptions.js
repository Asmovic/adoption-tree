const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');

const {
  index,
  myAdoptions,
  makeRequest,
  estimate,
  rates,
  details,
  paymentDetails,
  myPayments,
} = require('../../http/controllers/adoptionsController');

router.get('/', authorize, index);
router.get('/mine', authorize, myPayments);
router.get('/mineadoptions', authorize, myAdoptions);
router.get('/rates', authorize, rates);
router.post('/estimate', authorize, estimate);
router.post('/', authorize, makeRequest);
router.get('/:id', authorize, paymentDetails);
router.get('/donor/:id', authorize, details);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
