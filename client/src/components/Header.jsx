import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (user) navigate("/result");
        else setShowLogin(true);
    };

    return (
        <motion.div
            className="flex flex-col justify-center items-center text-center my-20 text-[var(--text-primary)] transition-colors duration-500"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Top Badge with Dynamic Accent Highlight */}
            <motion.div
                className="inline-flex gap-2 px-5 py-1.5 rounded-full border w-[300px] items-center justify-center font-semibold text-sm tracking-wide bg-[var(--bg-secondary)] text-[var(--accent-highlight)] transition-colors duration-500"
                style={{
                    borderColor: "var(--accent-highlight)",
                    boxShadow: "0 0 15px var(--shadow-color)",
                }}
                initial={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p>Neural Image Generation v2.0</p>
                <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--accent-primary)]"></span>
            </motion.div>

            {/* Title with Dynamic Gradient */}
            <motion.h1 className="text-4xl max-w-[320px] sm:text-7xl sm:max-w-[650px] mx-auto mt-10 text-center font-black tracking-tight leading-none">
                Turn text to{" "}
                <motion.span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] transition-all duration-500"
                    style={{ filter: "drop-shadow(0 0 15px var(--btn-glow))" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 2 }}
                >
                    image
                </motion.span>
                , instantly.
            </motion.h1>

            <motion.p
                className="text-center max-w-xl mx-auto mt-6 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed transition-colors duration-500"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Synthesize high-fidelity digital art directly from your
                subconscious mind. Type your prompt variables and watch the
                algorithm optimize matrix rendering.
            </motion.p>

            {/* Dynamic Quantum Gradient Button */}
            <motion.button
                onClick={onClickHandler}
                className="sm:text-lg font-extrabold text-[var(--bg-primary)] bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] hover:text-[var(--text-primary)] w-auto mt-8 px-12 py-3.5 flex items-center gap-2 rounded-full transition-all duration-300"
                style={{ boxShadow: "0 0 25px var(--btn-glow)" }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px var(--btn-glow)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                transition={{
                    default: { duration: 0.5 },
                    opacity: { delay: 0.8 },
                    duration: 1,
                }}
                animate={{ opacity: 1 }}
            >
                Generate Synthesis
                <img
                    className="h-5 filter brightness-0 hover:brightness-100 transition-all duration-300"
                    src={assets.star_group}
                    alt=""
                />
            </motion.button>

            {/* Showcase Grid with Dynamic Hover Glow */}
            <motion.div
                className="flex flex-wrap justify-center mt-16 gap-4"
                initial={{ opacity: 0 }}
                transition={{ delay: 1, duration: 1 }}
                animate={{ opacity: 1 }}
            >
                {Array(6)
                    .fill("")
                    .map((item, index) => (
                        <motion.img
                            whileHover={{
                                scale: 1.08,
                                borderColor: "var(--accent-primary)",
                                boxShadow: "0 0 20px var(--btn-glow)",
                            }}
                            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 transition-all duration-300 cursor-pointer max-sm:w-11"
                            src={
                                index % 2 === 0
                                    ? assets.sample_img_1
                                    : assets.sample_img_2
                            }
                            alt=""
                            key={index}
                            width={75}
                        />
                    ))}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                animate={{ opacity: 1 }}
                className="mt-5 text-[var(--text-secondary)] opacity-50 text-xs tracking-widest uppercase font-mono transition-colors duration-500"
            >
                Outputs mapped from cloud layers
            </motion.p>
        </motion.div>
    );
};

export default Header;
