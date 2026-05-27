import React, { useContext } from "react";
import { assets } from "../assets/assets";
import CreditStar from "../imageComponents/CreditStar";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ThemeSelector from "./ThemeSelector";
import Logo from "../imageComponents/Logo";
import { Image as ImageIcon } from "lucide-react";

const Navbar = () => {
    const { user, setShowLogin, logout, credit } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between py-3 sm:py-5 mb-3 top-0 z-40 transition-colors duration-500 text-[var(--text-primary)] px-4 sm:px-6">
            {/* LOGO */}
            <Link to="/" className="shrink-0">
                <Logo className="w-28 sm:w-32 lg:w-40 transition-all duration-500 filter drop-shadow-[0_0_12px_var(--shadow-color)]" />
            </Link>

            {/* 🔥 FIX: Yahan se 'overflow-hidden' hata diya hai taaki dropdowns theek se khul sakein */}
            <div className="flex-1 flex justify-end">
                {user ? (
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                        {/* 1. Theme Selector */}
                        <div className="hidden md:block shrink-0">
                            <ThemeSelector />
                        </div>

                        {/* 2. GALLERY BUTTON */}
                        <Link
                            to="/gallery"
                            className="hidden md:flex items-center gap-1.5 font-medium text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors shrink-0 whitespace-nowrap"
                        >
                            <ImageIcon size={16} />
                            <span className="hidden lg:inline">Gallery</span>
                        </Link>

                        {/* 3. Credits Button */}
                        <button
                            onClick={() => navigate("./buycredit")}
                            className="flex items-center border px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:scale-105 cursor-pointer transition-all duration-300 gap-1.5 sm:gap-2 shadow-[0_0_10px_var(--shadow-color)] hover:shadow-[0_0_15px_var(--btn-glow)] bg-[var(--bg-secondary)] border-[var(--accent-primary)] shrink-0"
                        >
                            <CreditStar
                                size={16}
                                className="animate-spin-slow shrink-0"
                            />
                            <p className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] transition-colors duration-500 whitespace-nowrap">
                                <span className="hidden lg:inline">
                                    Fuel Left:{" "}
                                </span>
                                {credit}
                            </p>
                        </button>

                        {/* 4. Profile Dropdown */}
                        <p className="hidden lg:block pl-2 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap shrink-0">
                            Hi, {user.name}
                        </p>
                        <div className="relative group hidden md:block shrink-0 ml-1">
                            <img
                                src={assets.profile_icon}
                                alt="Profile"
                                className="w-9 h-9 object-cover rounded-full border cursor-pointer hover:scale-105 border-[var(--accent-highlight)]"
                            />
                            <div className="absolute hidden group-hover:block top-full right-0 z-50 pt-4">
                                <ul className="list-none m-0 p-1.5 rounded-xl border text-sm min-w-[125px] bg-[var(--bg-card)] border-[var(--border-color)] shadow-xl">
                                    <li
                                        onClick={logout}
                                        className="py-2 px-3 cursor-pointer rounded-lg font-medium text-center hover:bg-[var(--hover-bg)] hover:text-[var(--accent-primary)]"
                                    >
                                        Disconnect
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3 sm:gap-5 items-center">
                        {/* Logged Out Links */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-5 shrink-0">
                            <ThemeSelector />

                            <Link
                                to="/gallery"
                                className="flex items-center gap-1.5 font-medium text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors shrink-0 whitespace-nowrap"
                            >
                                <ImageIcon size={16} />
                                Gallery
                            </Link>

                            <p
                                onClick={() => navigate("/buycredit")}
                                className="cursor-pointer font-medium text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] shrink-0 whitespace-nowrap"
                            >
                                Pricing
                            </p>
                        </div>

                        {/* Login Button */}
                        <button
                            className="font-bold px-5 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-300 bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] text-[var(--bg-primary)] hover:scale-105 shadow-[0_0_15px_var(--shadow-color)] shrink-0 whitespace-nowrap"
                            onClick={() => setShowLogin(true)}
                        >
                            Initialize
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
