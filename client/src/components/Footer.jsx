import React from "react";
import { assets } from "../assets/assets";
import Logo from "../imageComponents/Logo";
import TwitterIcon from "../imageComponents/TwitterIcon";
import InstagramIcon from "../imageComponents/InstagramIcon";
import FacebookIcon from "../imageComponents/FacebookIcon";

const Footer = () => {
    return (
        <>
            <div
                // 🔥 ADDED: 'hidden sm:flex' - Mobile par gayab, Desktop par normal flex
                className="hidden md:flex items-center justify-between gap-4 py-3 mt-20 transition-colors duration-500 border-t border-transparent"
                style={{ borderTopColor: "var(--border-color)" }}
            >
                {/* Dynamic Logo Glow */}
                <Logo className="w-36 transition-all duration-500 filter drop-shadow-[0_0_8px_var(--shadow-color)]" />

                {/* Dynamic Text and Border Color */}
                <p className="flex-1 border-l border-[var(--border-color)] pl-4 text-sm text-[var(--text-secondary)] transition-colors duration-500">
                    Copyright @Lakshay | All rights reserved
                </p>

                {/* Social Icons with Theme Glow on Hover */}
                <div className="flex gap-2.5">
                    <FacebookIcon />
                    <InstagramIcon />
                    <TwitterIcon />
                </div>
            </div>
        </>
    );
};

export default Footer;
