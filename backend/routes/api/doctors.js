const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const authorize = require('../../middlewares/auth/authorize');
const {
  getDetails,
  fetchAll,
  saveDetails,
  updateDetails,
} = require('../../http/controllers/doctorsController');
const roles = require('./../../constants/roles');
const { hasRole } = require('./../../middlewares/auth/security');

router.get('/:id', authorize, getDetails);
router.get('/', authorize, fetchAll);
router.post('/', authorize, hasRole(roles.HOSPITAL_ADMIN.name), saveDetails);
router.patch('/:id', authorize, updateDetails);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
