const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const authorize = require('../../middlewares/auth/authorize');
const {
  index,
  requestAdopteeInfo,
  updateAdoptionGoal,
  myAdopteeInfoRequests,
} = require('../../http/controllers/donorsController');

router.get('/', authorize, index);
router.get('/adoptee-info-requests', authorize, myAdopteeInfoRequests);
router.post('/adoptee-info', authorize, requestAdopteeInfo);

router.patch('/adoption-goal', authorize, updateAdoptionGoal);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
