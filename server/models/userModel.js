import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creditBalance: { type: Number, default: 2 },
    isPro: { type: Boolean, default: false },
    proExpiresAt: { type: Date, default: null } // Optional: Pro expiry date
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;