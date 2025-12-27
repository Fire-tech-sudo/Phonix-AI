import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

/* ====================== REGISTER ====================== */
const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

/* ====================== LOGIN ====================== */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

/* ====================== GET USER CREDITS ====================== */
const userCredits = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

/* ====================== RAZORPAY INSTANCE ====================== */
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ====================== CREATE ORDER ====================== */
const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.userId; // from auth middleware
        const { planId } = req.body;

        if (!userId || !planId) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        let credits, plan, amount;
        switch (planId) {
            case "Basic":
                plan = "Basic"; credits = 100; amount = 10; break;      // ₹10
            case "Advanced":
                plan = "Advanced"; credits = 500; amount = 50; break;   // ₹50
            case "Business":
                plan = "Business"; credits = 5000; amount = 250; break; // ₹250
            default:
                return res.json({ success: false, message: "Plan Not Found" });
        }

        const transaction = await transactionModel.create({
            userId,
            plan,
            amount,
            credits,
            date: Date.now(),
            payment: false,
        });

        const options = {
            amount: amount * 100, // paise
            currency: process.env.CURRENCY || "INR",
            receipt: transaction._id.toString(), // link order->transaction
        };

        const order = await razorpayInstance.orders.create(options);

        // store orderId on transaction for easier reconciliation (optional but nice)
        await transactionModel.findByIdAndUpdate(transaction._id, { orderId: order.id });

        return res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

/* ====================== VERIFY PAYMENT (signature check) ====================== */
/* 
   Expect body:
   {
     razorpay_order_id,
     razorpay_payment_id,
     razorpay_signature
   }
*/
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Missing Razorpay fields" });
        }

        // 1) Verify signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const expectedSignature = hmac.digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.json({ success: false, message: "Signature verification failed" });
        }

        // 2) Fetch order to get the receipt (transaction id)
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        const transactionId = orderInfo?.receipt;
        if (!transactionId) {
            return res.json({ success: false, message: "Receipt not found on order" });
        }

        const transaction = await transactionModel.findById(transactionId);
        if (!transaction) {
            return res.json({ success: false, message: "Transaction not found" });
        }

        // Idempotency: if already marked paid, don't double-credit
        if (transaction.payment) {
            return res.json({ success: true, message: "Already credited" });
        }

        // 3) Credit user & mark transaction paid
        const user = await userModel.findById(transaction.userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const newBalance = (user.creditBalance || 0) + transaction.credits;

        await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });
        await transactionModel.findByIdAndUpdate(transaction._id, {
            payment: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            paidAt: Date.now(),
        });

        return res.json({ success: true, message: "Credits Added", credits: newBalance });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
