const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, resetUrl) => {
  console.log('📧 Attempting to send reset email to:', toEmail);
  console.log('📧 From:', process.env.EMAIL_USER);
  console.log('📧 Reset URL:', resetUrl);

  const mailOptions = {
    from:    `"GIU Nexus" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'GIU Nexus — Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below within 10 minutes:</p>
      <a href="${resetUrl}" style="padding:10px 20px;background:#4f46e5;color:#fff;
         border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    throw err;
  }
};

module.exports = { sendResetEmail };
