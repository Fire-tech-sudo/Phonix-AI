import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const GenerateBtn = () => {
    const { user, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (user) {
            navigate("/result");
        } else {
            setShowLogin(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // 🔥 FIX 1: Mobile par pb-28 taaki Bottom Navbar se overlap na ho, Desktop par pb-16
            className="pb-28 md:pb-16 text-center transition-colors duration-500 px-4"
        >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl mt-4 font-bold text-[var(--text-primary)] py-8 md:py-16 transition-colors duration-500">
                See the Magic. Try now
            </h1>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                transition={{
                    default: { duration: 0.5 },
                    opacity: { delay: 0.8 },
                    duration: 1,
                }}
                animate={{ opacity: 1 }}
                onClick={onClickHandler}
                // 🔥 FIX 2: Mobile par button ki padding (px-8) aur text-size (text-sm) adjust kiya
                className="inline-flex items-center gap-2 px-8 sm:px-12 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] text-[var(--bg-primary)] m-auto transition-all duration-300 shadow-[0_0_20px_var(--shadow-color)] hover:shadow-[0_0_30px_var(--btn-glow)]"
            >
                Generate Images
                {/* 🔥 FIX 3: Icon ko bhi mobile par thoda chota (h-4) kiya */}
                <img
                    src={assets.star_group}
                    alt=""
                    className="h-4 sm:h-6 filter brightness-0 transition-all duration-300"
                />
            </motion.button>
        </motion.div>
    );
};

export default GenerateBtn;
