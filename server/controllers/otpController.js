import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import sendOtpEmail from "../utils/sendEmail.js";
import { validateEmail } from "../utils/validators.js";

/* ====================== SEND OTP FOR REGISTRATION (API Route) ====================== */
export const sendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.json({ success: false, message: "Email is required" });

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid)
      return res.json({ success: false, message: emailCheck.message });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Account already exists" });

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await otpModel.deleteMany({ email });
    await otpModel.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email successfully" });
  } catch (error) {
    console.log("Send OTP Error:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

/* ====================== VERIFY OTP HELPER (Doosri file se call hoga) ====================== */
export const verifyOtpHelper = async (email, otp) => {
  const record = await otpModel.findOne({ email });

  if (!record) {
    return {
      success: false,
      message: "OTP not found or expired. Request a new one.",
    };
  }

  if (record.expiresAt < new Date()) {
    await otpModel.deleteOne({ _id: record._id });
    return { success: false, message: "OTP has expired." };
  }

  if (record.attempts >= 5) {
    return { success: false, message: "Too many failed attempts." };
  }

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) {
    await otpModel.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
    return { success: false, message: "Invalid OTP" };
  }

  // Agar OTP sahi hai, toh use delete kar do aur success bhej do
  await otpModel.deleteOne({ _id: record._id });
  return { success: true };
};
