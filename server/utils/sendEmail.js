import nodemailer from 'nodemailer';
import nodemailerStub from 'nodemailer-stub'; // optional for testing

export const sendVerificationEmail = async (email, token) => {
  // create test account dynamically (Ethereal)
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const verificationLink = `${process.env.CLIENT_URL}/api/v1/auth/verify-email/${token}`;

  const info = await transporter.sendMail({
    from: `"Baraka Bites App" <${testAccount.user}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <h4>Verify Your Email</h4>
      <p>Click the link below:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
