import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
// 🔥 Lucide Icons aur custom CrossIcon
import { User, Mail, Lock } from "lucide-react";
import CrossIcon from "../imageComponents/CrossIcon";

const Login = () => {
    const [state, setState] = useState("Login");
    const { setShowLogin, backendUrl, setToken, setUser } =
        useContext(AppContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
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
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(
                    backendUrl + "/api/user/register",
                    { name, email, password },
                );

                if (data.success || data.sucess) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
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
                    className="text-center text-3xl font-bold mb-2 transition-colors duration-500 uppercase tracking-wide"
                    style={{ color: "var(--text-primary)" }}
                >
                    {state}
                </h1>
                <p className="text-sm text-center mb-6 opacity-80">
                    Welcome back! Please {state} to continue.
                </p>

                {/* Form Inputs Container */}
                <div className="flex flex-col gap-4">
                    {/* --- FULL NAME INPUT (Sign Up Only) --- */}
                    {state !== "Login" && (
                        <div
                            className="border px-5 py-3 flex items-center gap-3.5 rounded-full transition-all duration-300 group"
                            style={{
                                // Dynamic border toggle handled purely via CSS Variables on state focus
                                borderColor: "var(--border-color)",
                                backgroundColor: "var(--bg-input)",
                            }}
                            // Tailwind focus-within variables setup for instant color upgrade
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
                                style={{ color: "var(--text-secondary)" }}
                            />
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder="Full Name"
                                required
                                className="outline-none text-sm w-full bg-transparent transition-colors duration-500"
                                style={{ color: "var(--text-primary)" }}
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
                            style={{ color: "var(--text-secondary)" }}
                        />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
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
                            style={{ color: "var(--text-secondary)" }}
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            required
                            className="outline-none text-sm w-full bg-transparent transition-colors duration-500"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>
                </div>

                <p
                    className="text-xs my-4 w-fit cursor-pointer hover:underline transition-colors duration-300 font-medium"
                    style={{ color: "var(--accent-primary)" }}
                >
                    Forgot Password?
                </p>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-full font-bold tracking-wide mt-2 transition-all duration-300 cursor-pointer"
                    style={{
                        background:
                            "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                        color: "var(--bg-primary)",
                        boxShadow: "0 4px 15px var(--btn-glow)",
                    }}
                >
                    {state === "Login" ? "Login" : "Create Account"}
                </motion.button>

                {/* Toggle System Text */}
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

                {/* Reusable CrossIcon */}
                <CrossIcon
                    size={14}
                    onClick={() => setShowLogin(false)}
                    className="absolute top-5 right-5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer"
                />
            </motion.form>
        </div>
    );
};

export default Login;
