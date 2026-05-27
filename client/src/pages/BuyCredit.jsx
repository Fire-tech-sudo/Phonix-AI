import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Logo from "../imageComponents/Logo";

const BuyCredit = () => {
    const { user, backendUrl, loadCreditData, token, setShowLogin } =
        useContext(AppContext);
    const navigate = useNavigate();

    const initPay = async (order) => {
        if (!window.Razorpay) {
            console.error("Razorpay script not loaded!");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Credits Payment",
            description: "Credits Payment",
            order_id: order.id,
            handler: async (response) => {
                try {
                    const verify = await axios.post(
                        `${backendUrl}/api/user/verify-razor`,
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                        { headers: { token } },
                    );

                    if (verify.data.success) {
                        toast.success("Payment successful. Credits added.");
                        loadCreditData();
                    } else {
                        toast.error(
                            verify.data.message ||
                                "Payment verification failed",
                        );
                    }
                } catch (e) {
                    console.error(e);
                    toast.error(e.message);
                }
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const paymentRazorpay = async (planId) => {
        console.log("Button clicked for plan:", planId);
        try {
            if (!user) {
                setShowLogin(true);
                return;
            }

            const { data } = await axios.post(
                backendUrl + "/api/user/pay-razor",
                { planId },
                { headers: { token } },
            );

            console.log("Order data received:", data);

            if (data.success) {
                initPay(data.order);
            } else {
                toast.error("Failed to create order");
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // 🔥 FIX 1: pb-28 added for Bottom Navbar clearance on mobile
            className="min-h-[80vh] text-center pt-8 sm:pt-14 mb-10 pb-28 md:pb-10 transition-colors duration-500"
        >
            <button
                className="border px-6 sm:px-10 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 font-medium tracking-wide transition-colors duration-500 uppercase text-[10px] sm:text-xs"
                style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-secondary)",
                }}
            >
                Our Plans
            </button>
            <h1
                // 🔥 FIX 2: Responsive text sizes
                className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 transition-colors duration-500 px-4"
                style={{ color: "var(--text-primary)" }}
            >
                Choose The Plan
            </h1>

            <div className="flex flex-wrap justify-center gap-5 sm:gap-6 text-left px-2 sm:px-0">
                {plans.map((item, index) => (
                    <div
                        key={index}
                        // 🔥 FIX 3: w-full on mobile, auto width on bigger screens
                        className="w-full sm:w-auto min-w-[280px] sm:min-w-[300px] border rounded-2xl py-8 sm:py-12 px-6 sm:px-8 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left"
                        style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-color)",
                            boxShadow: "0 10px 30px var(--shadow-color)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <div className="mb-4">
                            <Logo className="w-28 sm:w-36 transition-all duration-500 filter drop-shadow-[0_0_8px_var(--shadow-color)]" />
                        </div>

                        <p
                            className="mt-2 sm:mt-4 mb-1 font-bold text-base sm:text-lg transition-colors duration-500 uppercase tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {item.id}
                        </p>

                        <p className="text-xs sm:text-sm mb-4 sm:mb-6 opacity-80">
                            {item.desc}
                        </p>

                        <p className="mb-4 sm:mb-2">
                            <span
                                className="text-3xl sm:text-4xl font-bold transition-colors duration-500"
                                style={{ color: "var(--accent-primary)" }}
                            >
                                ${item.price}
                            </span>
                            <span className="text-sm font-medium opacity-70">
                                {" "}
                                / {item.credits} credits
                            </span>
                        </p>

                        <motion.button
                            onClick={() => paymentRazorpay(item.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full font-bold mt-4 sm:mt-8 text-xs sm:text-sm rounded-xl py-3.5 sm:py-3 transition-all duration-300"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                                color: "var(--bg-primary)",
                                boxShadow: "0 4px 15px var(--btn-glow)",
                            }}
                        >
                            {user ? "Purchase" : "Get Started"}
                        </motion.button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default BuyCredit;
