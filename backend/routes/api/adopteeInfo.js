const router = require('express').Router();
const roles = require('./../../constants/roles');
const authorize = require('../../middlewares/auth/authorize');
const { hasRole } = require('./../../middlewares/auth/security');
const { handleError } = require('../../http/helpers/ErrorHandler');
const { getRequests, changeStatus } = require('../../http/controllers/adopteeInfoController');

router.get('/', authorize, hasRole(roles.ADMIN.name), getRequests);
router.patch('/:id/change-status', authorize, hasRole(roles.ADMIN.name), changeStatus);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
