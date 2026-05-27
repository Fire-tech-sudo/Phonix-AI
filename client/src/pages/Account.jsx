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
					className="px-6 py-2 rounded-full font-bold bg-[var(--accent-primary)] text-white transition-all duration-300 hover:scale-105 shadow-[0_0_15px_var(--shadow-color)]"
				>
					Go to Home
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto p-4 pt-8 text-[var(--text-primary)] pb-28">
			{/* ================= PROFILE HEADER ================= */}
			<div className="flex items-center gap-4 mb-8 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] shadow-[0_4px_20px_var(--shadow-color)] transition-all duration-500">
				<div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-[var(--bg-primary)] bg-gradient-to-br from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] shadow-[0_0_15px_var(--btn-glow)] transition-all duration-500">
					{user.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<h2 className="text-xl font-bold transition-colors duration-500">
						{user.name}
					</h2>
					<p className="text-sm font-medium text-[var(--accent-primary)] transition-colors duration-500">
						Fuel Available: {credit}
					</p>
				</div>
			</div>

			{/* ================= SETTINGS MENU ================= */}
			{/* 🔥 FIX 1: Yahan se 'overflow-hidden' hata diya taaki dropdown theek se khule */}
			<div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm mb-10 transition-all duration-500">
				{/* Pricing & Plans */}
				{/* first:rounded-t-2xl lagaya taaki hover effect container ke bahar na nikle */}
				<div
					onClick={() => navigate("/buycredit")}
					className="flex items-center justify-between p-4 border-b border-[var(--border-color)] active:bg-[var(--hover-bg)] cursor-pointer transition-colors first:rounded-t-2xl"
				>
					<div className="flex items-center gap-3">
						<CreditCard
							size={20}
							className="text-[var(--text-secondary)] transition-colors duration-500"
						/>
						<span className="font-medium transition-colors duration-500">
							Pricing & Plans
						</span>
					</div>
				</div>

				{/* App Theme */}
				<div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] transition-colors duration-500">
					<div className="flex items-center gap-3">
						<Moon
							size={20}
							className="text-[var(--text-secondary)] transition-colors duration-500"
						/>
						<span className="font-medium transition-colors duration-500">
							App Theme
						</span>
					</div>
					<div>
						<ThemeSelector />
					</div>
				</div>

				{/* Disconnect (Logout) */}
				{/* last:rounded-b-2xl lagaya taaki hover par aakhiri kone gol rahein */}
				<div
					onClick={logout}
					className="flex items-center justify-between p-4 active:bg-red-500/10 cursor-pointer transition-colors text-red-500 last:rounded-b-2xl"
				>
					<div className="flex items-center gap-3">
						<LogOut size={20} />
						<span className="font-medium">Disconnect</span>
					</div>
				</div>
			</div>

			{/* ================= MOBILE FOOTER ================= */}
			<div className="md:hidden flex flex-col items-center text-center mt-12 mb-6 border-t border-[var(--border-color)] pt-8 transition-colors duration-500">
				{/* 🔥 FIX 2: Logo se 'grayscale' hata diya aur transition add kar diya */}
				<div className="mb-4 opacity-80 transition-all duration-500">
					<Logo className="w-28 filter drop-shadow-[0_0_8px_var(--shadow-color)]" />
				</div>

				<p className="text-xs font-medium text-[var(--text-secondary)] mb-4 transition-colors duration-500">
					Copyright © 2026 Lakshay | All rights reserved.
				</p>

				{/* 🔥 FIX 3: Social icons me 'text-[var(--text-primary)]' aur transition add kiya */}
				<div className="flex gap-4 mb-6 opacity-80 text-[var(--text-primary)] transition-colors duration-500">
					<FacebookIcon />
					<InstagramIcon />
					<TwitterIcon />
				</div>

				{/* Legal Links */}
				<div className="flex items-center justify-center gap-4 text-xs text-[var(--text-secondary)] opacity-80 mb-6 transition-colors duration-500">
					<span className="flex items-center gap-1 cursor-pointer hover:text-[var(--accent-primary)] transition-colors">
						<ShieldCheck size={14} /> Privacy
					</span>
					<span>•</span>
					<span className="flex items-center gap-1 cursor-pointer hover:text-[var(--accent-primary)] transition-colors">
						<FileText size={14} /> Terms
					</span>
				</div>

				{/* Location Tag */}
				<p className="text-[10px] text-[var(--text-secondary)] opacity-50 font-mono tracking-widest uppercase transition-colors duration-500">
					Made with ❤️ in Meerut
				</p>
			</div>
		</div>
	);
};

export default Account;
