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
            className="pb-16 text-center transition-colors duration-500"
        >
            {/* Dynamic Text Color Applied */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-[var(--text-primary)] py-6 md:py-16 transition-colors duration-500">
                See the Magic. Try now
            </h1>

            {/* Dynamic Gradient Button with Glow */}
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
                className="inline-flex items-center gap-2 px-12 py-3 rounded-full font-bold bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] text-[var(--bg-primary)] m-auto transition-all duration-300 shadow-[0_0_20px_var(--shadow-color)] hover:shadow-[0_0_30px_var(--btn-glow)]"
            >
                Generate Images
                {/* Image filter to ensure it contrasts well against the dynamic gradient button */}
                <img
                    src={assets.star_group}
                    alt=""
                    className="h-6 filter brightness-0 transition-all duration-300"
                />
            </motion.button>
        </motion.div>
    );
};

export default GenerateBtn;
