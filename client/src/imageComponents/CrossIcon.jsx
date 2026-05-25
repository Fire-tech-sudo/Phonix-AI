import React from "react";
import { motion } from "framer-motion";

const CrossIcon = ({ className, size = 11, onClick }) => {
    return (
        <motion.svg
            onClick={onClick}
            className={`transition-colors duration-300 cursor-pointer ${className}`}
            width={size}
            height={size}
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            // ✨ Framer Motion Animations
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{
                scale: 1.2,
                rotate: 90,
                filter: "drop-shadow(0 0 8px var(--btn-glow))",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <path
                d="M10 1L1 10M1.00001 1L10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </motion.svg>
    );
};

export default CrossIcon;
