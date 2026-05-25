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
            className="min-h-[80vh] text-center pt-14 mb-10 transition-colors duration-500"
        >
            <button
                className="border px-10 py-2 rounded-full mb-6 font-medium tracking-wide transition-colors duration-500 uppercase text-xs"
                style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-secondary)",
                }}
            >
                Our Plans
            </button>
            <h1
                className="text-center text-3xl font-bold mb-6 sm:mb-10 transition-colors duration-500"
                style={{ color: "var(--text-primary)" }}
            >
                Choose The Plan
            </h1>

            <div className="flex flex-wrap justify-center gap-6 text-left">
                {plans.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-2xl py-12 px-8 hover:scale-105 transition-all duration-300"
                        style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-color)",
                            boxShadow: "0 10px 30px var(--shadow-color)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {/*<img 
                            width={40} 
                            src={assets.logo_icon} 
                            alt="" 
                            style={{ filter: "drop-shadow(0 0 5px var(--accent-primary))" }}
                        />*/}
                        <Logo className="w-36 transition-all duration-500 filter drop-shadow-[0_0_8px_var(--shadow-color)]" />
                        <p
                            className="mt-4 mb-1 font-bold text-lg transition-colors duration-500 uppercase tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {item.id}
                        </p>
                        <p className="text-sm mb-6 opacity-80">{item.desc}</p>
                        <p className="mb-2">
                            <span
                                className="text-4xl font-bold transition-colors duration-500"
                                style={{ color: "var(--accent-primary)" }}
                            >
                                ${item.price}
                            </span>
                            <span className="font-medium opacity-70">
                                {" "}
                                / {item.credits} credits
                            </span>
                        </p>
                        <motion.button
                            onClick={() => paymentRazorpay(item.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full font-bold mt-8 text-sm rounded-xl py-3 min-w-52 transition-all duration-300"
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
