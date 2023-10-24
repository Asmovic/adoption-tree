const ejs = require('ejs');
const path = require('path');
const { readFileSync } = require('fs');
const nodemailer = require('nodemailer');
// const mailConfig = require('../config/mailConfig');

exports.sendEmail = async (receipient, subject, template, data = null) => {
  try {
    const html = readFileSync(
      path.join(__dirname, './templates', template + '.html'),
      'utf-8',
    );

    const body = ejs.render(html, data);

    await sendEmail_(receipient, subject, body);
  } catch (error) {
    console.error(error.message);
  }
};

exports.sendRawEmail = async (recipient, subject, message) => {
  try {
    await sendEmail_(recipient, subject, message);
  } catch (error) {
    console.log(error);
  }
};

const sendEmail_ = async (receipient, subject, body) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.zeptomail.com',
    port: process.env.MAIL_PORT,
    // secure: true,
    // service: mailConfig.service,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const message = {
    from: '"ANSHIA" <noreply@anshia.com.ng>',
    to: receipient,
    subject,
    html: body,
  };

  await transport.sendMail(message);
};
