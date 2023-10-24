const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');
const {
  doctorRegistrationData,
  hospitalDepartmentAdd,
  fetchLgas,
  fetchHospitals,
  stateId,
} = require('./../../http/controllers/formDataController');

router.get('/doctor-registration-data', authorize, doctorRegistrationData);
router.post('/hospital-department-add', authorize, hospitalDepartmentAdd);
router.get('/lgas', authorize, fetchLgas);
router.get('/state-id', stateId);
router.get('/hospitals', authorize, fetchHospitals);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
