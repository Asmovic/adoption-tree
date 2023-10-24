var express = require('express');
var router = express.Router();

// TODO: Test removal of escape characters
router.get(
  '/*',
  // /^\/(governors-address|our-adopters|office-the-es|imshia|health-plan-benefits|adopters|testimonials)$/,
  (req, res) => {
    res.render('index', { title: 'Welcome' });
  },
);

module.exports = router;
