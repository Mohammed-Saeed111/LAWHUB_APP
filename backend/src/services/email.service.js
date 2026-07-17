import nodemailer from 'nodemailer';

let transporter = null;
const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) {
    console.warn('⚠️  SMTP not configured — emails will be logged to console.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const tx = getTransporter();
  if (!tx) { console.log('📧 [DEV EMAIL]', { to, subject }); console.log(html); return { mocked: true }; }
  return tx.sendMail({ from: process.env.MAIL_FROM || 'Egypt LawHub <no-reply@lawhub.eg>', to, subject, html });
};

export const sendOtpEmail = async (to, otp) => {
  const html = `
  <div style="background:#0A0E17;padding:32px;font-family:Arial,sans-serif;color:#EDEDED;">
    <div style="max-width:480px;margin:auto;background:#111726;border-radius:16px;padding:32px;border:1px solid #C9A24B33;">
      <h1 style="color:#C9A24B;margin:0 0 8px;">محاميك — Egypt LawHub</h1>
      <p style="color:#9AA3B2;margin:0 0 24px;">Your Gateway to Legal Excellence</p>
      <p>Your verification code is:</p>
      <div style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#C9A24B;text-align:center;padding:16px;background:#0A0E17;border-radius:12px;">${otp}</div>
      <p style="color:#9AA3B2;font-size:13px;margin-top:24px;">This code expires in ${process.env.OTP_EXPIRES_MINUTES || 10} minutes.</p>
    </div>
  </div>`;
  return sendEmail({ to, subject: 'Your LawHub verification code', html });
};
