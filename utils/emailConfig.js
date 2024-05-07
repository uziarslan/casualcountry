const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'jaylan.franecki19@ethereal.email',
    pass: 'wsUDnXgrufsKQ6MpGP',
  },
});

module.exports = transporter;
