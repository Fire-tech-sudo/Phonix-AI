import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { useTheme } from "./context/ThemeContext";
import BottomNavbar from "./components/BottomNavbar";
// import GallerySidebar from "./components/GallerySidebar";
import Account from "./pages/Account";
import Gallery from "./pages/Gallery";

const App = () => {
  const { currentTheme } = useTheme();
  const { showLogin } = useContext(AppContext);

  return (
    <div className="px-4 sm:px-10 md:px-14 md:pb-0 lg:px-28 min-h-screen transition-colors duration-500 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ==================== 🌌 HIGH-TECH BACKGROUND LAYER ==================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Glow Ball 1 - Top Right (Direct uses custom CSS animation) */}
        <div
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] min-w-[400px] min-h-[400px] rounded-full mix-blend-screen filter blur-[120px] animate-bg-pulse-slow transition-colors duration-1000"
          style={{
            background:
              "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
          }}
        />

        {/* Glow Ball 2 - Bottom Left */}
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] min-w-[500px] min-h-[500px] rounded-full mix-blend-screen filter blur-[140px] animate-bg-pulse-slow transition-colors duration-1000"
          style={{
            background:
              "radial-gradient(circle, var(--btn-gradient-end) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />

        {/* Glow Ball 3 - Ambient Center */}
        <div
          className="absolute top-[30%] left-[25%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[100px] animate-bg-pulse-slow transition-colors duration-1000"
          style={{
            background:
              "radial-gradient(circle, var(--accent-highlight) 0%, transparent 60%)",
            animationDelay: "-8s",
            opacity: 0.15,
          }}
        />

        {/* Cyber Developer Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] transition-all duration-500"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      {/* ================================================================================= */}

      {/* Main Content Containers */}
      <div className="relative z-10">
        {/* Aapka Navbar, Routing, Pages, Footer sab yahan aayega */}
        <ToastContainer position="bottom-right" />
        <Navbar />
        {showLogin && <Login />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/buycredit" element={<BuyCredit />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/profile" element={<Account />} />
        </Routes>
        <BottomNavbar />
        <Footer />
      </div>
    </div>
  );
};

export default App;
