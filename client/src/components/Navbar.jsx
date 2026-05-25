import React, { useContext } from "react";
import { assets } from "../assets/assets";
import CreditStar from "../imageComponents/CreditStar";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ThemeSelector from "./ThemeSelector";
import Logo from "../imageComponents/Logo";

const Navbar = () => {
    const { user, setShowLogin, logout, credit } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between py-5 transition-colors duration-500 text-[var(--text-primary)]">
            <Link to="/">
                <Logo className="w-28 sm:w-32 lg:w-40 transition-all duration-500 filter drop-shadow-[0_0_12px_var(--shadow-color)]" />
            </Link>

            <div>
                {user ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Dynamic Theme Selector Button */}
                        <ThemeSelector />

                        {/* Credits Button with Dynamic Background and Accent Border */}
                        <button
                            onClick={() => navigate("./buycredit")}
                            className="flex items-center border px-4 sm:px-5 py-2 rounded-full hover:scale-105 cursor-pointer transition-all duration-300 gap-2 shadow-[0_0_10px_var(--shadow-color)] hover:shadow-[0_0_15px_var(--btn-glow)] bg-[var(--bg-secondary)] border-[var(--accent-primary)]"
                        >
                            {/*<img
                                className="w-4 transition-all duration-500"
                                style={{
                                    filter: "drop-shadow(0 0 5px var(--accent-primary))",
                                }}
                                src={assets.credit_star}
                                alt="Credit Star"
                            />*/}
                            <CreditStar
                                size={16}
                                className="animate-spin-slow"
                            />
                            <p className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] transition-colors duration-500">
                                Fuel Left: {credit}
                            </p>
                        </button>

                        <p className="max-sm:hidden pl-4 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-500">
                            Hi, {user.name}
                        </p>

                        {/* Profile with Dynamic Highlight Ring */}
                        <div className="relative group">
                            <img
                                src={assets.profile_icon}
                                alt="Profile"
                                className="w-9 rounded-full border cursor-pointer transition-all duration-300 hover:scale-105 border-[var(--accent-highlight)]"
                                style={{
                                    filter: "drop-shadow(0 0 8px var(--shadow-color))",
                                }}
                            />
                            <div className="absolute hidden group-hover:block top-0 right-0 z-10 rounded pt-12 text-[var(--text-primary)]">
                                <ul className="list-none m-0 p-1.5 rounded-xl border text-sm transition-colors duration-500 min-w-[125px] bg-[var(--bg-card)] border-[var(--border-color)] shadow-[0_0_25px_var(--shadow-color)]">
                                    <li
                                        onClick={logout}
                                        className="py-2 px-3 cursor-pointer transition-colors rounded-lg font-medium text-center hover:bg-[var(--hover-bg)] hover:text-[var(--accent-primary)]"
                                    >
                                        Disconnect
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-5 items-center sm:gap-7">
                        <ThemeSelector />
                        <p
                            onClick={() => navigate("/buycredit")}
                            className="cursor-pointer font-medium transition-colors text-sm sm:text-base text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                        >
                            Pricing
                        </p>

                        {/* Core Dynamic Gradient CTA */}
                        <button
                            className="font-bold px-7 py-2 sm:px-9 text-sm rounded-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] text-[var(--bg-primary)] hover:text-[var(--text-primary)] shadow-[0_0_20px_var(--shadow-color)] hover:shadow-[0_0_30px_var(--btn-glow)]"
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
