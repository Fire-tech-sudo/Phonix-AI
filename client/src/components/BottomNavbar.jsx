import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Image, Sparkles, User } from "lucide-react";
import { AppContext } from "../context/AppContext";

const BottomNavbar = () => {
  const location = useLocation();
  const { user, setShowLogin } = useContext(AppContext);

  // Route check karne ka function
  const isActive = (path) => location.pathname === path;

  // Active aur Inactive tabs ke liye common styles
  const activeClass =
    "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-2xl px-5 py-1.5";
  const inactiveClass =
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-1.5";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-2 px-2 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-2xl border-t transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        opacity: 0.95,
      }}
    >
      {/* 1. Home Tab */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/") ? activeClass : inactiveClass}`}
      >
        <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
        <span className="font-medium text-[10px] mt-1">Home</span>
      </Link>

      {/* 2. Gallery Tab */}
      <Link
        to="/gallery"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/gallery") ? activeClass : inactiveClass}`}
      >
        <Image size={22} strokeWidth={isActive("/gallery") ? 2.5 : 2} />
        <span className="font-medium text-[10px] mt-1">Gallery</span>
      </Link>

      {/* 3. Generate (Create) Tab */}
      <Link
        to="/result"
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            setShowLogin(true);
          }
        }}
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/result") ? activeClass : inactiveClass}`}
      >
        <Sparkles size={22} strokeWidth={isActive("/result") ? 2.5 : 2} />
        <span className="font-medium text-[10px] mt-1">Create</span>
      </Link>

      {/* 4. Account Tab */}
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/account") ? activeClass : inactiveClass}`}
      >
        <User size={22} strokeWidth={isActive("/profile") ? 2.5 : 2} />
        <span className="font-medium text-[10px] mt-1">Account</span>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
