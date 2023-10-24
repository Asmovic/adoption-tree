const mailgun = require('mailgun-js');
const logger = require('../lib/logger');
const path = require('path');
const fs = require('fs');
const readFile = fs.readFileSync;
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const templatesDirectory = path.join(__dirname, './../mail/templates');

// const { EMAIL_DEFAULT_SENDER, EMAIL_API_KEY, EMAIL_DOMAIN } = process.env;
// const mailgunConfig = {
//   apiKey: EMAIL_API_KEY,
//   domain: EMAIL_DOMAIN,
// };

class EmailService {
  constructor () {
    // this.mg = mailgun(mailgunConfig);
    this.transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
    });
    // // Initialize email templates
    this.init();
  }

  // Read email templates and store them in a templates object.
  init () {
    const activateAccount = readFile(
      path.join(templatesDirectory, 'activateAccount.html'),
      'utf-8',
    );
    const confirmPassword = readFile(
      path.join(templatesDirectory, 'confirmPassword.html'),
      'utf-8',
    );
    // const passwordResetEmail = readFile(path.join(templatesDirectory, 'passwordResetEmail.html'), 'utf-8')

    this.mailTemplates = {
      activateAccount,
      // passwordResetEmail,
      confirmPassword,
    };
  }

  // Send email
  // sendEmail (options, data) {
  //   console.log('Options ====>:', options);
  //   console.log('Data ====>:', data);
  //   let {
  //     recipients, subject, text, html,
  //   } = options;

  //   data = data || {};

  //   if (!(recipients && subject && (html || text))) { throw Error('Provide required options'); }
  //   const to = Array.isArray(recipients) ? recipients.join(',') : recipients;

  //   if (html) {
  //     html = ejs.render(html, data);
  //   }

  //   if (text) {
  //     text = ejs.render(text, data);
  //   }

  //   const mailData = {
  //     from: process.env.MAIL_FROM,
  //     to,
  //     subject,
  //     text: text || html,
  //     html,
  //   };

  //   this.transport.sendMail(mailData, (error, info) => {
  //     if (error) {
  //       return console.log(error);
  //     }
  //     console.log('Successfully sent');
  //   });
  //   // this.mg.messages().send(mailData, (error, body) => {
  //   //   if (error) {
  //   //     logger.error(error);
  //   //   }
  //   // });
  // }

  sendEmail (options, data) {
    const transport = nodemailer.createTransport({
      host: 'smtp.zeptomail.com',
      port: 587,
      auth: {
        user: 'emailapikey',
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Example Team" <noreply@anshia.com.ng>',
      to: 'admin@ekotoken.ng',
      subject: 'Test Email',
      html: 'Test email sent successfully.',
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Successfully sent');
    });
  }
  // sendPasswordResetEmail(firstName, email, password) {
  //   const options = {
  //     recipients: [email],
  //     subject: "Password Reset | Bluecab",
  //     html: this.mailTemplates.passwordResetEmail,
  //   };

  //   const data = {
  //     firstName,
  //     email,
  //     password,
  //   };

  //   this.sendEmail(options, data);
  // }

  sendUserActivationEmail (firstName, email, activationCode) {
    const options = {
      recipients: [email],
      subject: 'Activate your account.',
      html: this.mailTemplates.activateAccount,
    };

    const data = {
      firstName,
      activationCode,
    };

    this.sendEmail(options, data);
  }
}

module.exports = new EmailService();
