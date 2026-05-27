import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ThemeSelector from "../components/ThemeSelector";
import {
	User,
	CreditCard,
	LogOut,
	Moon,
	ShieldCheck,
	FileText,
} from "lucide-react";
import FacebookIcon from "../imageComponents/FacebookIcon";
import InstagramIcon from "../imageComponents/InstagramIcon";
import TwitterIcon from "../imageComponents/TwitterIcon";
import Logo from "../imageComponents/Logo";

const Account = () => {
	const { user, logout, credit } = useContext(AppContext);
	const navigate = useNavigate();

	// Agar user logged in nahi hai
	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 text-[var(--text-primary)] pb-24">
				<User
					size={60}
					className="mb-4 text-[var(--text-secondary)] opacity-50"
				/>
				<h2 className="text-2xl font-bold mb-2">Account Details</h2>
				<p className="text-[var(--text-secondary)] mb-6">
					Please log in to view your account options.
				</p>
				<button
					onClick={() => navigate("/")}
					className="px-6 py-2 rounded-full font-bold bg-[var(--accent-primary)] text-white"
				>
					Go to Home
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto p-4 pt-8 text-[var(--text-primary)] pb-28">
			{/* ================= PROFILE HEADER ================= */}
			<div className="flex items-center gap-4 mb-8 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
				<div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-[var(--bg-primary)] bg-gradient-to-br from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] shadow-[0_0_15px_var(--btn-glow)]">
					{user.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<h2 className="text-xl font-bold">{user.name}</h2>
					<p className="text-sm font-medium text-[var(--accent-primary)]">
						Fuel Available: {credit}
					</p>
				</div>
			</div>

			{/* ================= SETTINGS MENU ================= */}
			<div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm mb-10">
				{/* Pricing & Plans */}
				<div
					onClick={() => navigate("/buycredit")}
					className="flex items-center justify-between p-4 border-b border-[var(--border-color)] active:bg-[var(--hover-bg)] cursor-pointer transition-colors"
				>
					<div className="flex items-center gap-3">
						<CreditCard
							size={20}
							className="text-[var(--text-secondary)]"
						/>
						<span className="font-medium">Pricing & Plans</span>
					</div>
				</div>

				{/* App Theme */}
				<div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
					<div className="flex items-center gap-3">
						<Moon
							size={20}
							className="text-[var(--text-secondary)]"
						/>
						<span className="font-medium">App Theme</span>
					</div>
					<div>
						<ThemeSelector />
					</div>
				</div>

				{/* Disconnect (Logout) */}
				<div
					onClick={logout}
					className="flex items-center justify-between p-4 active:bg-red-500/10 cursor-pointer transition-colors text-red-500"
				>
					<div className="flex items-center gap-3">
						<LogOut size={20} />
						<span className="font-medium">Disconnect</span>
					</div>
				</div>
			</div>

			{/* ================= MOBILE FOOTER ================= */}
			{/* Ye footer sirf mobile par dikhega kyunki sm:hidden laga hai */}
			<div className="md:hidden flex flex-col items-center text-center mt-12 mb-6 border-t border-[var(--border-color)] pt-8">
				{/* Logo in Mobile Footer */}
				<div className="mb-4 grayscale opacity-70">
					<Logo className="w-28" />
				</div>

				<p className="text-xs font-medium text-[var(--text-secondary)] mb-4">
					Copyright © 2026 Lakshay | All rights reserved.
				</p>

				{/* Social Icons (Aapke custom icons) */}
				<div className="flex gap-4 mb-6 opacity-70">
					<FacebookIcon />
					<InstagramIcon />
					<TwitterIcon />
				</div>

				{/* Legal Links */}
				<div className="flex items-center justify-center gap-4 text-xs text-[var(--text-secondary)] opacity-80 mb-6">
					<span className="flex items-center gap-1 cursor-pointer hover:text-[var(--accent-primary)]">
						<ShieldCheck size={14} /> Privacy
					</span>
					<span>•</span>
					<span className="flex items-center gap-1 cursor-pointer hover:text-[var(--accent-primary)]">
						<FileText size={14} /> Terms
					</span>
				</div>

				{/* Location Tag */}
				<p className="text-[10px] text-[var(--text-secondary)] opacity-40 font-mono tracking-widest uppercase">
					Made with ❤️ in Meerut
				</p>
			</div>
		</div>
	);
};

export default Account;
