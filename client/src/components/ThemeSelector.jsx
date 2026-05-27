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
    /* Is container ko humne responsive width di hai taaki sidebar me fit rahe */
    <div className="relative z-50 w-full max-w-[260px]" ref={ref}>
      {/* ✅ Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 w-full
                   rounded-xl border cursor-pointer select-none
                   transition-all duration-300"
        style={{
          background: "var(--bg-card)",
          borderColor: isOpen ? "var(--accent-primary)" : "var(--border-color)",
          color: "var(--text-primary)",
          boxShadow: isOpen ? "0 0 20px var(--btn-glow)" : "none",
        }}
      >
        {/* Color Dots */}
        <div className="flex gap-1 shrink-0">
          <motion.span
            layoutId="dot1"
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: active.colors["--accent-primary"] }}
          />
          <motion.span
            layoutId="dot2"
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: active.colors["--accent-secondary"] }}
          />
        </div>

        {/* Theme Name */}
        <span className="text-xs sm:text-sm font-medium flex-1 text-left truncate">
          {active.icon} {active.name}
        </span>

        {/* Arrow */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          className="opacity-60 shrink-0"
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

      {/* ✅ Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            /* FIX: Yahan 'right-0' lagane se dropdown right alignment pakad lega, 
              aur 'min-w-[260px]' se choti screen par overflow band ho jayega.
            */
            className="absolute top-full mt-1.5 right-0 w-full min-w-[260px] max-w-[290px]
                       p-1.5 rounded-xl border backdrop-blur-xl 
                       max-h-[50vh] overflow-y-auto overflow-x-hidden"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              boxShadow: `0 15px 35px var(--shadow-color), 0 0 25px var(--btn-glow)`,
            }}
          >
            {/* Header */}
            <div
              className="px-2.5 py-2 text-[10px] font-bold
                         uppercase tracking-wider border-b mb-1 sticky top-0 z-10"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border-color)",
                background: "var(--bg-card)",
              }}
            >
              🎨 Choose Theme
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-0.5">
              {all.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ x: 2, background: "var(--hover-bg)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    changeTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-2 py-2
                             rounded-lg border text-left cursor-pointer transition-colors"
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
                  }}
                >
                  {/* Swatches */}
                  <div className="flex gap-0.5 shrink-0">
                    {[
                      "--bg-primary",
                      "--accent-primary",
                      "--accent-secondary",
                    ].map((key) => (
                      <span
                        key={key}
                        className="w-3 h-3 rounded-sm border border-white/5 shrink-0"
                        style={{ background: theme.colors[key] }}
                      />
                    ))}
                  </div>

                  {/* Name */}
                  <span className="flex-1 text-xs font-medium truncate">
                    {theme.icon} {theme.name}
                  </span>

                  {/* Checkmark */}
                  {currentTheme === theme.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="shrink-0"
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
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
