require("dotenv").config();
const nodemailer = require("nodemailer");
const asyncHandler = require("../utils/asyncHandler");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

module.exports = transporter;

// Function to send email
const sendEmail = asyncHandler(async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank BackEnd" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "Welcome to Bank BackEnd Project!";
  const text = `Hello ${name},\n\nThank you for registering with Bank BackEnd Project. We're excited to have you on board!`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with Bank BackEnd Project. We're excited to have you on board!</p>`;
  await sendEmail(userEmail, subject, text, html);
};
const sendLoginEmail = asyncHandler( async (userEmail, name, loginDetails = {}) => {
  const { ipAddress = "Unknown", device = "Unknown Device" } = loginDetails;
  const loginTime = new Date().toLocaleString();

  const subject = "🔐 New Login to Your Bank BackEnd Account";

  const text = `
Hello ${name},

We detected a new login to your Bank BackEnd Project account.

Login Details:
Time: ${loginTime}
IP Address: ${ipAddress}
Device: ${device}

If this was you, no further action is required.

If this wasn't you, please reset your password immediately.

Regards,
Bank BackEnd Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
      
      <h2 style="color: #1e3a8a; text-align: center;">🔐 Login Alert</h2>

      <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>

      <p style="font-size: 15px; color: #444;">
        We detected a new login to your <strong>Bank BackEnd Project</strong> account.
      </p>

      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>🕒 Time:</strong> ${loginTime}</p>
        <p style="margin: 5px 0;"><strong>🌍 IP Address:</strong> ${ipAddress}</p>
        <p style="margin: 5px 0;"><strong>💻 Device:</strong> ${device}</p>
      </div>

      <p style="font-size: 14px; color: #555;">
        If this was you, you can safely ignore this email.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" 
           style="background-color: #dc2626; color: #ffffff; padding: 12px 25px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Secure Your Account
        </a>
      </div>

      <p style="font-size: 13px; color: #777;">
        If you did not log in, please reset your password immediately.
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} Bank BackEnd Project. All rights reserved.
      </p>
    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
});

module.exports = {
  sendRegistrationEmail,
  sendLoginEmail,
};
