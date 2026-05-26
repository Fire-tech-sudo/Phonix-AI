import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use an App Password, not your main password
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"PixoraAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;max-width:400px">
        <h2>Verify your account</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:8px;color:#4f46e5">${otp}</h1>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export default sendOtpEmail;
