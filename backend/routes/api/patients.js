const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');

const {
  getPatients, checkin, getPatientById, getPatientCheckins,
} = require('../../http/controllers/patientsController');

router.get('/:id/checkins', authorize, getPatientCheckins);
router.get('/:id', authorize, getPatientById);
router.get('/', authorize, getPatients);
router.post('/checkin', authorize, checkin);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
