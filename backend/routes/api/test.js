const router = require('express').Router();
const emailService = require('./../../services/EmailService');
const smsService = require('./../../services/SmsService');

router.post('/email', async (req, res) => {
  console.log('Here');
  const { recipients } = req.body;
  const options = {
    recipients,
    subject: 'Test email from AdoptionTree',
    html:
      '<h3>This is a test email body. </h3><br />It contains very basic formatting.',
    from: process.env.MAIL_FROM,
  };

  try {
    emailService.sendEmail(options);
  } catch (error) {
    req.logger.error(error);
  }

  res.send('done.');
});

router.post('/sms', async (req, res) => {
  const { recipients } = req.body;
  const message = 'Test email from AdoptionTree';

  try {
    smsService.sendSms(message, recipients);
  } catch (error) {
    req.logger.error(error);
  }

  res.send('done.');
});

module.exports = router;
