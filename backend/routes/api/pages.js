const router = require('express').Router();
const authorize = require('../../middlewares/auth/authorize');
const { handleError } = require('../../http/helpers/ErrorHandler');

const {
  getPageBySlug, index, store, getPageById, update,
} = require('../../http/controllers/pagesController');

router.get('/:id(\\d+)', authorize, getPageById);
router.get('/:slug', getPageBySlug);
router.get('/', authorize, index);
router.post('/', authorize, store);
router.patch('/:id(\\d+)', authorize, update);
// router.post('/', authorize, checkin);

router.use((err, req, res) => {
  handleError(err, req, res);
});

module.exports = router;
