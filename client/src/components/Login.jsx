import React, {
    useContext,
    useEffect,
    useState,
    useRef,
    useCallback,
} from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import CrossIcon from "../imageComponents/CrossIcon";

const STATES = {
    LOGIN: "Login",
    SIGN_UP: "Sign Up",
    OTP: "OTP Verification",
};

const OTP_RESEND_SECONDS = 60;

const InputWrapper = ({ children }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div
            className="border px-5 py-3 flex items-center gap-3.5 rounded-full transition-all duration-300 group"
            style={{
                borderColor: focused
                    ? "var(--accent-primary)"
                    : "var(--border-color)",
                backgroundColor: "var(--bg-input)",
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            {children}
        </div>
    );
};

const Login = () => {
    const [state, setState] = useState(STATES.LOGIN);

    // AppContext se values le rahe hain
    const { setShowLogin, backendUrl, setToken, setUser } =
        useContext(AppContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(OTP_RESEND_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    useEffect(() => {
        if (state !== STATES.OTP) {
            setOtp(new Array(6).fill(""));
        }
        if (state === STATES.OTP) {
            setTimer(OTP_RESEND_SECONDS);
            setCanResend(false);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 400);
        }
    }, [state]);

    useEffect(() => {
        if (state !== STATES.OTP) return;
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [state, timer]);

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6)
            .split("");

        if (digits.length === 0) return;

        const newOtp = [...otp];
        digits.forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);

        const focusIndex = Math.min(digits.length, 5);
        setTimeout(() => inputRefs.current[focusIndex]?.focus(), 10);
    };

    const handleResendOtp = useCallback(async () => {
        if (!canResend || isLoading) return;
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/send-otp`,
                { email },
            );
            if (data.success) {
                toast.success("OTP resent successfully!");
                setTimer(OTP_RESEND_SECONDS);
                setCanResend(false);
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();
            } else {
                toast.error(data.message || "Failed to resend OTP.");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error resending OTP.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [canResend, isLoading, email, backendUrl]);

    // 🔥 YAHAN UPDATE KIYA HAI 🔥
    // Ye function AppContext aur localStorage dono update karega
    const applyAuthData = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);

        // Default header set kar rahe hain bina 'Bearer' ke (middle ware ke liye)
        axios.defaults.headers.common["token"] = data.token;

        setShowLogin(false);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        try {
            if (state === STATES.LOGIN) {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/login`,
                    { email, password },
                );
                if (data.success) {
                    applyAuthData(data);
                    toast.success("Logged in successfully!");
                } else {
                    toast.error(data.message);
                }
            } else if (state === STATES.SIGN_UP) {
                if (name.trim().length < 2) {
                    setIsLoading(false);
                    return toast.error("Name must be at least 2 characters.");
                }
                if (password.length < 8) {
                    setIsLoading(false);
                    return toast.error(
                        "Password must be at least 8 characters.",
                    );
                }

                const { data } = await axios.post(
                    `${backendUrl}/api/auth/send-otp`,
                    { email },
                );
                if (data.success) {
                    toast.success("OTP sent to your email!");
                    setState(STATES.OTP);
                } else {
                    toast.error(data.message);
                }
            } else if (state === STATES.OTP) {
                const otpString = otp.join("");
                if (otpString.length < 6 || otp.some((d) => d === "")) {
                    setIsLoading(false);
                    return toast.error("Please fill in all 6 OTP digits.");
                }

                const { data } = await axios.post(
                    `${backendUrl}/api/user/register`,
                    {
                        name,
                        email,
                        password,
                        otp: otpString,
                    },
                );

                if (data.success) {
                    applyAuthData(data); // Ye function chalte hi Context update hoga aur credits load ho jayenge
                    toast.success("Account created successfully!");
                } else {
                    toast.error(data.message || "Invalid OTP.");
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong.",
            );
        } finally {
            setIsLoading(false);
        }
    };

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
                    className="text-center text-3xl font-bold mb-2 uppercase tracking-wide flex justify-center items-center gap-3"
                    style={{ color: "var(--text-primary)" }}
                >
                    {state === STATES.OTP && (
                        <ShieldCheck
                            size={30}
                            style={{ color: "var(--accent-primary)" }}
                        />
                    )}
                    {state}
                </h1>

                <div className="text-sm text-center mb-6 opacity-80 flex flex-col gap-1">
                    {state === STATES.OTP ? (
                        <>
                            <span>
                                We've sent a verification code to{" "}
                                <b style={{ color: "var(--text-primary)" }}>
                                    {email}
                                </b>
                            </span>
                            <span
                                onClick={() => setState(STATES.SIGN_UP)}
                                className="text-xs cursor-pointer hover:underline font-bold transition-colors"
                                style={{ color: "var(--accent-primary)" }}
                            >
                                Wrong email? Change here
                            </span>
                        </>
                    ) : (
                        <span>Welcome! Please {state} to continue.</span>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {state !== STATES.OTP ? (
                            <motion.div
                                key="credentials"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col gap-4"
                            >
                                {state === STATES.SIGN_UP && (
                                    <InputWrapper>
                                        <User
                                            size={18}
                                            className="opacity-60 group-focus-within:opacity-100"
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
                                            autoComplete="name"
                                            required
                                            minLength={2}
                                            className="outline-none text-sm w-full bg-transparent"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        />
                                    </InputWrapper>
                                )}

                                <InputWrapper>
                                    <Mail
                                        size={18}
                                        className="opacity-60 group-focus-within:opacity-100"
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
                                        autoComplete="email"
                                        required
                                        className="outline-none text-sm w-full bg-transparent"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <Lock
                                        size={18}
                                        className="opacity-60 group-focus-within:opacity-100"
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
                                        autoComplete={
                                            state === STATES.LOGIN
                                                ? "current-password"
                                                : "new-password"
                                        }
                                        required
                                        minLength={8}
                                        className="outline-none text-sm w-full bg-transparent"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                </InputWrapper>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-6 py-4"
                            >
                                <div
                                    className="flex justify-between w-full gap-2 sm:gap-3"
                                    onPaste={handlePaste}
                                >
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            aria-label={`OTP digit ${index + 1}`}
                                            ref={(el) =>
                                                (inputRefs.current[index] = el)
                                            }
                                            value={digit}
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
                                                borderColor: digit
                                                    ? "var(--accent-primary)"
                                                    : "var(--border-color)",
                                                color: "var(--text-primary)",
                                                boxShadow: digit
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
                                        disabled={!canResend || isLoading}
                                        className={`font-bold transition-all duration-300 ${
                                            canResend && !isLoading
                                                ? "hover:underline cursor-pointer"
                                                : "opacity-40 cursor-not-allowed"
                                        }`}
                                        style={{
                                            color: "var(--accent-primary)",
                                        }}
                                    >
                                        {isLoading
                                            ? "Sending..."
                                            : "Resend Code"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {state === STATES.LOGIN && (
                    <p
                        className="text-xs my-4 w-fit cursor-pointer hover:underline font-medium"
                        style={{ color: "var(--accent-primary)" }}
                    >
                        Forgot Password?
                    </p>
                )}

                {state !== STATES.LOGIN && <div className="h-4" />}

                <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    disabled={isLoading}
                    className="w-full py-3 rounded-full font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                        background:
                            "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                        color: "var(--bg-primary)",
                        boxShadow: "0 4px 15px var(--btn-glow)",
                    }}
                >
                    {isLoading && (
                        <Loader2 size={18} className="animate-spin" />
                    )}
                    {state === STATES.LOGIN
                        ? "Login"
                        : state === STATES.SIGN_UP
                          ? "Create Account"
                          : "Verify OTP"}
                </motion.button>

                {state !== STATES.OTP && (
                    <div
                        className="mt-6 text-center text-sm"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {state === STATES.LOGIN ? (
                            <p>
                                Don't have an account?{" "}
                                <span
                                    className="font-bold cursor-pointer hover:underline pl-1"
                                    style={{ color: "var(--accent-primary)" }}
                                    onClick={() => setState(STATES.SIGN_UP)}
                                >
                                    Sign Up
                                </span>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <span
                                    className="font-bold cursor-pointer hover:underline pl-1"
                                    style={{ color: "var(--accent-primary)" }}
                                    onClick={() => setState(STATES.LOGIN)}
                                >
                                    Login
                                </span>
                            </p>
                        )}
                    </div>
                )}

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
