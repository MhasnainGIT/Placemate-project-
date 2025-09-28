// Simple console fallback if no SMTP is configured
export const sendEmailOTP = async (toEmail, otp) => {
  // If SMTP env not provided, log to console
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log(`[MFA] OTP for ${toEmail}: ${otp}`);
    return;
  }

  const { default: nodemailer } = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const from = SMTP_FROM || 'no-reply@placemate.app';
  const subject = 'Your Placemate OTP Code';
  const text = `Your OTP is ${otp}. It will expire in 5 minutes.`;

  await transporter.sendMail({ from, to: toEmail, subject, text });
};
