import userModel from "../models/userModel.js";

// Pro status check
export const getProStatus = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.userId)
            .select("name email isPro proExpiresAt");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Auto-revoke if expired
        if (user.isPro && user.proExpiresAt && user.proExpiresAt < new Date()) {
            user.isPro = false;
            user.proExpiresAt = null;
            await user.save();
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Pro cancel
export const cancelPro = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isPro) {
            return res.status(400).json({ message: "User is not Pro" });
        }

        user.isPro = false;
        user.proExpiresAt = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Pro cancelled successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
