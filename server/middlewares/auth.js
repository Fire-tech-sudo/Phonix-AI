import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const userAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorised, Login Again.",
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // attach directly, not inside body
            next();
        } else {
            return res.json({
                success: false,
                message: "Not Authorised, Login Again.",
            });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { error: "Too many OTP requests. Try again in 10 minutes." },
});

export default userAuth;
