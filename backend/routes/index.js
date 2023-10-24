var express = require('express');
var router = express.Router();

router.use('/api', require('./api'));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', function (req, res) {
  res.render('index', { title: 'Dashboard' });
});

router.get('/adoptions', function (req, res) {
  res.render('index', { title: 'My Adoptions' });
});

router.get('/adoption-payment-status', async (req, res) => {
  res.render('index', { title: 'Payment Status' });
});

router.get('/payment-status', async (req, res) => {
  res.render('index', { title: 'Payment Status' });
});

router.get('/update-profile', async (req, res) => {
  res.render('index', { title: 'Update your profile' });
});

router.get('/adopt', function (req, res) {
  res.render('index', { title: 'Adopt Now' });
});

router.get('/adoptees', function (req, res) {
  res.render('index', { title: 'Adoptees' });
});

router.get('/doctors', function (req, res) {
  res.render('index', { title: 'Manage Doctors' });
});

router.get('/depts', function (req, res) {
  res.render('index', { title: 'Manage Departments' });
});

router.get('/logs(/*)?', function (req, res) {
  res.render('index', { title: 'Logs' });
});

router.get('/manage-pages(/*)?', function (req, res) {
  res.render('index', { title: 'Manage pages' });
});

router.get('/patients', function (req, res) {
  res.render('index', { title: 'Patients List' });
});

router.get('/patients/checkin', function (req, res) {
  res.render('index', { title: 'Patient Checkin' });
});

router.get('/users', function (req, res) {
  res.render('index', { title: 'Users' });
});

router.use('/pages', require('./pages'));

router.get('*', (req, res) => {
  res.status(404).render('index', { title: 'Page not found' });
});

module.exports = router;
