import express from "express";
import { otpLimiter } from "../middlewares/auth.js";
// OTP bhejne wala function otpController se aayega
import { sendRegistrationOtp } from "../controllers/otpController.js";

const otpRouter = express.Router();

// // Rate limit: max 3 OTP requests per 10 minutes per IP
// const otpLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 3,
//   message: { error: "Too many OTP requests. Try again in 10 minutes." },
// });

// ── ROUTES ──────────────────────────────────────────

// Attach the limiter and the controller function to the route
otpRouter.post("/send-otp", otpLimiter, sendRegistrationOtp);

export default otpRouter;
