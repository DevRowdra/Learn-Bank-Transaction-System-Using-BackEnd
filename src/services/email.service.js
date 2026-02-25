require('dotenv').config();
const nodemailer = require('nodemailer');
const asyncHandler = require('../utils/asyncHandler');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;


// Function to send email
const sendEmail = asyncHandler( async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank BackEnd" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
})


const sendRegistrationEmail = async (userEmail,name) => {
  const subject = 'Welcome to Bank BackEnd Project!';
  const text = `Hello ${name},\n\nThank you for registering with Bank BackEnd Project. We're excited to have you on board!`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with Bank BackEnd Project. We're excited to have you on board!</p>`; 
  await sendEmail(userEmail, subject, text, html);
  } 

module.exports = {
  sendRegistrationEmail,
};