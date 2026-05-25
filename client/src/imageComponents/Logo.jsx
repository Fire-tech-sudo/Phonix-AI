import React from 'react';

const Logo = ({ className }) => {
    return (
        <svg 
            className={className} 
            width="130" 
            height="38" 
            viewBox="0 0 130 38" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Dynamic Gradient using Theme Variables */}
                <linearGradient id="dynamicLogoGradient" x1="0" y1="4" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--btn-gradient-start)"/>
                    <stop offset="100%" stopColor="var(--btn-gradient-end)"/>
                </linearGradient>
                
                {/* Cyber Laser Glow Filter for Icon */}
                <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Camera Icon - Iska rang gradient ke hisaab se badlega */}
            <path 
                filter="url(#laserGlow)" 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M0 17.7778C0 11.2829 -2.05305e-07 8.03542 2.0177 6.0177C4.03542 4 7.28286 4 13.7778 4H17.2222C23.7171 4 26.9647 4 28.9822 6.0177C31 8.03542 31 11.2829 31 17.7778V21.2222C31 27.7171 31 30.9647 28.9822 32.9822C26.9647 35 23.7171 35 17.2222 35H13.7778C7.28286 35 4.03542 35 2.0177 32.9822C-2.05305e-07 30.9647 0 27.7171 0 21.2222V17.7778ZM25.8333 11.75C25.8333 13.1767 24.6767 14.3333 23.25 14.3333C21.8233 14.3333 20.6667 13.1767 20.6667 11.75C20.6667 10.3233 21.8233 9.16667 23.25 9.16667C24.6767 9.16667 25.8333 10.3233 25.8333 11.75ZM18.9444 21.2222C18.9444 23.1246 17.4024 24.6667 15.5 24.6667C13.5976 24.6667 12.0556 23.1246 12.0556 21.2222C12.0556 19.3199 13.5976 17.7778 15.5 17.7778C17.4024 17.7778 18.9444 19.3199 18.9444 21.2222ZM22.3889 21.2222C22.3889 25.0268 19.3046 28.1111 15.5 28.1111C11.6954 28.1111 8.61111 25.0268 8.61111 21.2222C8.61111 17.4177 11.6954 14.3333 15.5 14.3333C19.3046 14.3333 22.3889 17.4177 22.3889 21.2222Z" 
                fill="url(#dynamicLogoGradient)"
            />
            
            {/* Pixora Text - Iska rang light/dark mode ke text ke hisaab se automatic hoga */}
            <text 
                x="40" 
                y="30" 
                fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif" 
                fontWeight="900" 
                fontSize="28" 
                fill="var(--text-primary)" 
                letterSpacing="-1"
                className="transition-colors duration-500"
            >
                Pixora
            </text>
        </svg>
    );
};

export default Logo;
