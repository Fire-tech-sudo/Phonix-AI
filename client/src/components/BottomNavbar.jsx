import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Image, Sparkles, User } from "lucide-react";
import { AppContext } from "../context/AppContext";

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowLogin } = useContext(AppContext);

  const isActive = (path) => location.pathname === path;

  /* Padding ko control kiya taaki items tightly squished na ho choti screen par */
  const activeClass =
    "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-xl px-3 sm:px-5 py-1.5";
  const inactiveClass =
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 sm:px-4 py-1.5";

  const handleProtectedNav = (e, path) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
    } else {
      navigate(path);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-2 px-1 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-2xl border-t transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        opacity: 0.95,
      }}
    >
      {/* 1. Home */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/") ? activeClass : inactiveClass}`}
      >
        <Home size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
        <span className="font-semibold text-[9px] mt-0.5">Home</span>
      </Link>

      {/* 2. Gallery */}
      <Link
        to="/gallery"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/gallery") ? activeClass : inactiveClass}`}
      >
        <Image size={20} strokeWidth={isActive("/gallery") ? 2.5 : 2} />
        <span className="font-semibold text-[9px] mt-0.5">Gallery</span>
      </Link>

      {/* 3. Create */}
      <Link
        to="/result"
        onClick={(e) => handleProtectedNav(e, "/result")}
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/result") ? activeClass : inactiveClass}`}
      >
        <Sparkles size={20} strokeWidth={isActive("/result") ? 2.5 : 2} />
        <span className="font-semibold text-[9px] mt-0.5">Create</span>
      </Link>

      {/* 4. Account */}
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center active:scale-95 transition-all duration-300 ${isActive("/profile") ? activeClass : inactiveClass}`}
      >
        <User size={20} strokeWidth={isActive("/profile") ? 2.5 : 2} />
        <span className="font-semibold text-[9px] mt-0.5">Account</span>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
