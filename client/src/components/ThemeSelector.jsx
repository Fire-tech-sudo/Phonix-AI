import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { currentTheme, changeTheme, getAllThemes, getTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const active = getTheme();
  const all = getAllThemes();

  return (
    <div className="relative z-50" ref={ref}>
      {/* ✅ Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5
                   rounded-xl border cursor-pointer
                   transition-all duration-300 min-w-[220px]"
        style={{
          background: "var(--bg-card)",
          borderColor: isOpen ? "var(--accent-primary)" : "var(--border-color)",
          color: "var(--text-primary)",
          boxShadow: isOpen ? "0 0 20px var(--btn-glow)" : "none",
        }}
      >
        {/* Color Dots */}
        <div className="flex gap-1.5">
          <motion.span
            layoutId="dot1"
            className="w-3 h-3 rounded-full"
            style={{ background: active.colors["--accent-primary"] }}
          />
          <motion.span
            layoutId="dot2"
            className="w-3 h-3 rounded-full"
            style={{ background: active.colors["--accent-secondary"] }}
          />
        </div>

        {/* Theme Name */}
        <span className="text-sm font-medium flex-1 text-left">
          {active.icon} {active.name}
        </span>

        {/* Arrow */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="opacity-60"
        >
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {/* ✅ Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full mt-2 left-0 right-0
                       min-w-[300px] p-2 rounded-2xl border
                       backdrop-blur-xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              boxShadow: `0 25px 60px var(--shadow-color),
                          0 0 40px var(--btn-glow)`,
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-2.5 text-xs font-semibold
                         uppercase tracking-widest border-b mb-1.5"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              🎨 Choose Theme
            </motion.div>

            {/* Theme Options */}
            {all.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 * (index + 1),
                  duration: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  x: 4,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  changeTheme(theme.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-3
                           rounded-xl border text-left cursor-pointer
                           transition-colors duration-200 mb-1"
                style={{
                  background:
                    currentTheme === theme.id
                      ? "var(--hover-bg)"
                      : "transparent",
                  borderColor:
                    currentTheme === theme.id
                      ? "var(--accent-primary)"
                      : "transparent",
                  color: "var(--text-primary)",
                  boxShadow:
                    currentTheme === theme.id
                      ? "0 0 15px var(--btn-glow)"
                      : "none",
                }}
              >
                {/* Color Swatches */}
                <div className="flex gap-1">
                  {[
                    "--bg-primary",
                    "--accent-primary",
                    "--accent-secondary",
                    "--accent-highlight",
                  ].map((key) => (
                    <motion.span
                      key={key}
                      whileHover={{ scale: 1.3, rotate: 15 }}
                      className="w-4 h-4 rounded-md border
                                 border-white/10"
                      style={{
                        background: theme.colors[key],
                      }}
                    />
                  ))}
                </div>

                {/* Theme Name */}
                <span className="flex-1 text-sm font-medium">
                  {theme.icon} {theme.name}
                </span>

                {/* Active Check */}
                <AnimatePresence>
                  {currentTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <circle
                          cx="9"
                          cy="9"
                          r="8"
                          fill="var(--accent-primary)"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M5.5 9L8 11.5L12.5 6.5"
                          stroke="var(--accent-primary)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
