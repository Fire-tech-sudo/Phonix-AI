import nodemailer from "nodemailer";

// FIX: Singleton transporter — created once, reused across all calls
const transporter = nodemailer.createTransport({
  host: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// FIX: Verify connection on startup so misconfiguration fails fast
transporter.verify((error) => {
  if (error) {
    console.error("[Mailer] SMTP connection failed:", error);
  } else {
    console.log("[Mailer] SMTP server is ready.");
  }
});

const sendOtpEmail = async (toEmail, otp) => {
  // FIX: Sanitize OTP before injecting into HTML (defense-in-depth)
  const safeOtp = String(otp).replace(/[^0-9]/g, "");

  await transporter.sendMail({
    from: `"PixoraAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code – PixoraAI",
    html: `
      <div style="font-family:sans-serif;max-width:420px;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
        <h2 style="margin-top:0">Verify your account</h2>
        <p>Use the OTP below to complete your registration. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#4f46e5;margin:24px 0">
          ${safeOtp}
        </div>
        <p style="color:#6b7280;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export default sendOtpEmail;
