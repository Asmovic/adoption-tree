module.exports = {
    driver: process.env.MAIL_DRIVER || 'smtp',
    host: process.env.MAIL_HOST || 'smtp.mailgun.org',
    port: process.env.MAILPORT || 587,
    username: process.env.MAIL_USERNAME || '',
    password: process.env.MAIL_PASSWORD || '',
    service: process.env.MAIL_SERVICE || '',
    from: {
        address: process.env.MAIL_FROM_ADDRESS || 'hello@example.com',
        name: process.env.MAIL_FROM_NAME || 'Example',
    },
};
