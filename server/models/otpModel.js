import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // hashed
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.models.otp || mongoose.model("Otp", otpSchema);

export default otpModel;
