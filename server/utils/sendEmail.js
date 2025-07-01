import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.API_URL}/api/v1/auth/verify-email/${token}`;

    const info = await transporter.sendMail({
      from: `"Baraka Bites App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify your email',
      html: `
        <h4>Verify Your Email</h4>
        <p>Click the link below:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });

    console.log('✅ Verification email sent: %s', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    throw new Error('Could not send verification email. Please try again later.');
  }
};

export const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const info = await transporter.sendMail({
      from: `"Baraka Bites App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <h4>Reset Your Password</h4>
        <p>Click the link below to reset your password. This link expires in 1 hour:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log('✅ Reset email sent: %s', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send reset password email:', error.message);
    throw new Error('Could not send reset email. Please try again later.');
  }
};
