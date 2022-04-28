const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transport.sendMail({
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log(err?.message)
    throw new Error(err?.message);
  }
};

export default sendEmail;
