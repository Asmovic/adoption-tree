const router = require('express').Router();
const { handleError } = require('../../http/helpers/ErrorHandler');
const authorize = require('../../middlewares/auth/authorize');
const { index, store, update } = require('../../http/controllers/healthPlansController');

router.get('/', authorize, index);
router.post('/', authorize, store);
router.patch('/:id', authorize, update);

router.use((err, req, res, next) => {
  handleError(err, req, res);
});

module.exports = router;
