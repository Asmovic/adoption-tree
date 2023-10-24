const express = require('express');
const router = express.Router();
const account = require('./account');

// Routes only accessible during development
// They are used mostly for testing features
// through an API console or browser
if (['development', undefined].includes(process.env.NODE_ENV)) {
  console.log('Got here');
  router.use('/test', require('./test'));
}

router.use('/account', account);
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/adoptions', require('./adoptions'));
router.use('/dashboard', require('./dashboard'));
router.use('/adopters', require('./donors'));
router.use('/form-data', require('./form-data'));
router.use('/pages', require('./pages'));
router.use('/payments', require('./payments'));
router.use('/patients', require('./patients'));
router.use('/doctors', require('./doctors'));
router.use('/health-plans', require('./healthPlans'));
router.use('/vision-board', require('./visionBoard'));
router.use('/hospitals', require('./hospitals'));
router.use('/settings', require('./settings'));
router.use('/subscriptions', require('./subscriptions'));
router.use('/adoptee-info', require('./adopteeInfo'));
router.use('/ext', require('./external'));
router.use('/cron', require('./cron'));
// 404
router.all('/*', (req, res) => {
  res.status(404).json({
    errors: [
      {
        message: `Endpoint ${req.originalUrl} not found.`,
      },
    ],
  });
});

module.exports = router;
