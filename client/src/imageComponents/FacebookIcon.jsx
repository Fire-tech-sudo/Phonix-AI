import React from 'react';
import { motion } from 'framer-motion';

const FacebookIcon = ({ className, size = 35 }) => {
    return (
        <motion.svg 
            className={`cursor-pointer ${className}`}
            width={size} 
            height={size} 
            viewBox="0 0 35 35" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            // ✨ Framer Motion hover bounce & active theme glow
            whileHover={{ 
                scale: 1.1, 
                y: -4,
                filter: "drop-shadow(0 4px 12px var(--btn-glow))"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
            {/* Outer Circle Border */}
            <circle 
                cx="17.5" 
                cy="17.5" 
                r="17.25" 
                stroke="currentColor" 
                className="transition-colors duration-300 text-[var(--border-color)] hover:text-[var(--accent-primary)]"
                strokeWidth="0.5"
            />
            {/* Facebook 'f' Logo */}
            <path 
                d="M18.9221 24.8058H15.6399V17.8176H14V15.1201H15.6399V13.5042C15.6399 11.3076 16.5624 10 19.197 10H21.3874V12.6944H20.0192C18.9951 12.6944 18.9267 13.0702 18.9267 13.7729L18.9221 15.1201H21.4029L21.1125 17.8145H18.9221V24.8027V24.8058Z" 
                fill="currentColor"
                className="transition-colors duration-300 text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
            />
        </motion.svg>
    );
};

export default FacebookIcon;
