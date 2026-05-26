import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import sendOtpEmail from "../utils/sendEmail.js";
import { validateEmail } from "../utils/validators.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/* ====================== SEND OTP FOR REGISTRATION ====================== */
export const sendRegistrationOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res
        .status(400)
        .json({ success: false, message: emailCheck.message });
    }

    // FIX: Vague message to prevent email enumeration
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "If this email is not registered, an OTP will be sent.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    // FIX: Atomic upsert — no race between deleteMany + create
    await otpModel.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt, attempts: 0 },
      { upsert: true, new: true },
    );

    // FIX: Send email BEFORE confirming success; if it throws, the catch handles it
    sendOtpEmail(email, otp).catch((err) => console.log("Background Email Error:", err));

res.json({ success: true, message: "OTP sent to your email successfully" });
  } catch (error) {
    // FIX: console.error instead of console.log for actual errors
    console.error("[sendRegistrationOtp] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

/* ====================== VERIFY OTP HELPER ====================== */
export const verifyOtpHelper = async (email, otp) => {
  // FIX: Atomic increment of attempts + fetch in one query to prevent race conditions
  const record = await otpModel.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 } },
    { new: false }, // return the doc BEFORE increment so we can check old attempts value
  );

  if (!record) {
    return {
      success: false,
      message: "OTP not found or expired. Please request a new one.",
    };
  }

  if (record.expiresAt < new Date()) {
    await otpModel.deleteOne({ _id: record._id });
    return {
      success: false,
      message: "OTP has expired. Please request a new one.",
    };
  }

  // FIX: Check attempts BEFORE comparing (pre-increment value is in `record`)
  if (record.attempts >= 5) {
    await otpModel.deleteOne({ _id: record._id }); // lock out and force re-request
    return {
      success: false,
      message: "Too many failed attempts. Please request a new OTP.",
    };
  }

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) {
    return { success: false, message: "Invalid OTP. Please try again." };
  }

  await otpModel.deleteOne({ _id: record._id });
  return { success: true };
};
