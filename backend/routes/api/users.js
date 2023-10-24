const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const authorize = require('../../middlewares/auth/authorize');
const {
  index,
  show,
  updateProfile,
  toggleProfileVisibility,
  createAdmin,
} = require('../../http/controllers/usersController');

router.get('/', authorize, index);
router.get('/:id', authorize, show);
router.put('/', authorize, updateProfile);
router.patch('/profile-visibility', authorize, toggleProfileVisibility);
router.post('/admin', authorize, createAdmin);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
