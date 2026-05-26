import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
// 🔥 Lucide Icons aur custom CrossIcon
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import CrossIcon from "../imageComponents/CrossIcon";

const Login = () => {
    // States: "Login", "Sign Up", "OTP Verification"
    const [state, setState] = useState("Login");
    const { setShowLogin, backendUrl, setToken, setUser } =
        useContext(AppContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // --- OTP States & Logic ---
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Timer Effect
    useEffect(() => {
        let interval;
        if (state === "OTP Verification" && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [state, timer]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Auto-focus previous input on Backspace
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0 &&
            inputRefs.current[index - 1]
        ) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("text")
            .slice(0, 6)
            .split("");
        if (pastedData.length > 0) {
            let newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (i < 6 && !isNaN(char)) newOtp[i] = char;
            });
            setOtp(newOtp);
            // Focus next empty input or last
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[focusIndex].focus();
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        setTimer(60);
        setCanResend(false);
        setOtp(new Array(6).fill(""));

        try {
            // Yahan humara send-otp endpoint call hoga
            const { data } = await axios.post(
                backendUrl + "/api/auth/send-otp",
                { email },
            );
            if (data.success) {
                toast.success("OTP Resent Successfully!");
            } else {
                toast.error(data.message || "Failed to resend OTP");
            }
        } catch (error) {
            toast.error("Error resending OTP");
        }
    };

    // --- Main Submit Handler ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            // ================= 1. LOGIN MODE =================
            if (state === "Login") {
                const { data } = await axios.post(
                    backendUrl + "/api/user/login",
                    { email, password },
                );

                if (data.success || data.sucess) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                    toast.success("Logged In Successfully!");
                } else {
                    toast.error(data.message);
                }
            }
            // ================= 2. SIGN UP MODE (Request OTP) =================
            else if (state === "Sign Up") {
                // Name validation (Optional front-end check)
                if (name.trim().length < 2) {
                    return toast.error(
                        "Name must be at least 2 characters long",
                    );
                }

                // Call the Send OTP API
                const { data } = await axios.post(
                    backendUrl + "/api/auth/send-otp",
                    { email },
                );

                if (data.success || data.sucess) {
                    toast.success("OTP sent to your email!");
                    setState("OTP Verification");
                    setTimer(60);
                    setCanResend(false);
                } else {
                    toast.error(data.message);
                }
            }
            // ================= 3. OTP VERIFICATION MODE (Final Register) =================
            else if (state === "OTP Verification") {
                const otpString = otp.join("");
                if (otpString.length < 6) {
                    toast.error("Please enter a valid 6-digit OTP");
                    return;
                }

                // Yahan final register API call hogi saari details ke sath
                const { data } = await axios.post(
                    backendUrl + "/api/user/register",
                    { name, email, password, otp: otpString },
                );

                if (data.success || data.sucess) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                    toast.success("Account Created Successfully!");
                } else {
                    toast.error(data.message || "Invalid OTP");
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // ... (Baaki poora UI/return statement exactly same rahega, usme koi change nahi hai)
    return (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex justify-center items-center transition-all duration-500">
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-10 rounded-2xl border transition-colors duration-500 w-[90%] max-w-md"
                style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    boxShadow:
                        "0 20px 50px var(--shadow-color), 0 0 20px var(--btn-glow)",
                    color: "var(--text-secondary)",
                }}
            >
                <h1
                    className="text-center text-3xl font-bold mb-2 transition-colors duration-500 uppercase tracking-wide flex justify-center items-center gap-3"
                    style={{ color: "var(--text-primary)" }}
                >
                    {state === "OTP Verification" && (
                        <ShieldCheck
                            size={30}
                            style={{ color: "var(--accent-primary)" }}
                        />
                    )}
                    {state}
                </h1>

                <p className="text-sm text-center mb-6 opacity-80">
                    {state === "OTP Verification"
                        ? `We've sent a verification code to ${email}`
                        : `Welcome back! Please ${state} to continue.`}
                </p>

                {/* Form Inputs Container */}
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {state !== "OTP Verification" ? (
                            <motion.div
                                key="credentials"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col gap-4"
                            >
                                {/* --- FULL NAME INPUT (Sign Up Only) --- */}
                                {state === "Sign Up" && (
                                    <div
                                        className="border px-5 py-3 flex items-center gap-3.5 rounded-full transition-all duration-300 group"
                                        style={{
                                            borderColor: "var(--border-color)",
                                            backgroundColor: "var(--bg-input)",
                                        }}
                                        onFocus={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--accent-primary)")
                                        }
                                        onBlur={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--border-color)")
                                        }
                                    >
                                        <User
                                            size={18}
                                            className="transition-colors duration-300 opacity-60 group-focus-within:opacity-100"
                                            style={{
                                                color: "var(--text-secondary)",
                                            }}
                                        />
                                        <input
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            value={name}
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            className="outline-none text-sm w-full bg-transparent transition-colors duration-500"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        />
                                    </div>
                                )}

                                {/* --- EMAIL ID INPUT --- */}
                                <div
                                    className="border px-5 py-3 flex items-center gap-3.5 rounded-full transition-all duration-300 group"
                                    style={{
                                        borderColor: "var(--border-color)",
                                        backgroundColor: "var(--bg-input)",
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--accent-primary)")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--border-color)")
                                    }
                                >
                                    <Mail
                                        size={18}
                                        className="transition-colors duration-300 opacity-60 group-focus-within:opacity-100"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    />
                                    <input
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        value={email}
                                        type="email"
                                        placeholder="Email ID"
                                        required
                                        className="outline-none text-sm w-full bg-transparent transition-colors duration-500"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                </div>

                                {/* --- PASSWORD INPUT --- */}
                                <div
                                    className="border px-5 py-3 flex items-center gap-3.5 rounded-full transition-all duration-300 group"
                                    style={{
                                        borderColor: "var(--border-color)",
                                        backgroundColor: "var(--bg-input)",
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--accent-primary)")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--border-color)")
                                    }
                                >
                                    <Lock
                                        size={18}
                                        className="transition-colors duration-300 opacity-60 group-focus-within:opacity-100"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    />
                                    <input
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        value={password}
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="outline-none text-sm w-full bg-transparent transition-colors duration-500"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            /* --- OTP INPUT SECTION --- */
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center gap-6 py-4"
                            >
                                <div
                                    className="flex justify-between w-full gap-2 sm:gap-3"
                                    onPaste={handlePaste}
                                >
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            ref={(el) =>
                                                (inputRefs.current[index] = el)
                                            }
                                            value={data}
                                            onChange={(e) =>
                                                handleOtpChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleOtpKeyDown(index, e)
                                            }
                                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all duration-300 outline-none"
                                            style={{
                                                backgroundColor:
                                                    "var(--bg-input)",
                                                borderColor: data
                                                    ? "var(--accent-primary)"
                                                    : "var(--border-color)",
                                                color: "var(--text-primary)",
                                                boxShadow: data
                                                    ? "0 0 10px var(--btn-glow)"
                                                    : "none",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor =
                                                    "var(--accent-primary)";
                                                e.target.style.boxShadow =
                                                    "0 0 10px var(--btn-glow)";
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    e.target.style.borderColor =
                                                        "var(--border-color)";
                                                    e.target.style.boxShadow =
                                                        "none";
                                                }
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Resend Timer Area */}
                                <div className="flex items-center justify-between w-full text-sm">
                                    <p className="font-medium">
                                        Time left:{" "}
                                        <span
                                            style={{
                                                color: "var(--accent-primary)",
                                            }}
                                        >
                                            00:
                                            {timer < 10 ? `0${timer}` : timer}
                                        </span>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={!canResend}
                                        className={`font-bold transition-all duration-300 ${canResend ? "hover:underline cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                                        style={{
                                            color: "var(--accent-primary)",
                                        }}
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {state === "Login" && (
                    <p
                        className="text-xs my-4 w-fit cursor-pointer hover:underline transition-colors duration-300 font-medium"
                        style={{ color: "var(--accent-primary)" }}
                    >
                        Forgot Password?
                    </p>
                )}

                {/* Spacing correction if Signup or OTP */}
                {state !== "Login" && <div className="h-4"></div>}

                {/* Dynamic Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-full font-bold tracking-wide transition-all duration-300 cursor-pointer"
                    style={{
                        background:
                            "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                        color: "var(--bg-primary)",
                        boxShadow: "0 4px 15px var(--btn-glow)",
                    }}
                >
                    {state === "Login"
                        ? "Login"
                        : state === "Sign Up"
                          ? "Create Account"
                          : "Verify OTP"}
                </motion.button>

                {/* Toggle System Text */}
                {state !== "OTP Verification" && (
                    <div
                        className="mt-6 text-center text-sm transition-colors duration-500"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {state === "Login" ? (
                            <p>
                                Don't have an account?{" "}
                                <span
                                    className="font-bold cursor-pointer transition-colors duration-300 hover:underline pl-1"
                                    style={{ color: "var(--accent-primary)" }}
                                    onClick={() => setState("Sign Up")}
                                >
                                    Sign Up
                                </span>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <span
                                    className="font-bold cursor-pointer transition-colors duration-300 hover:underline pl-1"
                                    style={{ color: "var(--accent-primary)" }}
                                    onClick={() => setState("Login")}
                                >
                                    Login
                                </span>
                            </p>
                        )}
                    </div>
                )}

                {/* Reusable CrossIcon */}
                <CrossIcon
                    size={14}
                    onClick={() => setShowLogin(false)}
                    className="absolute top-5 right-5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer z-50"
                />
            </motion.form>
        </div>
    );
};

export default Login;
