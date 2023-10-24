const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const authorize = require('../../middlewares/auth/authorize');
const { donorData, adopteeDashboardData } = require('../../http/controllers/statisticsController');

router.get('/adopter', authorize, donorData);
router.get('/adoptee', authorize, adopteeDashboardData);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
