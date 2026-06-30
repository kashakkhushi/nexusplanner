import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div id="splash-screen" className="relative flex flex-col items-center justify-center w-full h-full bg-[#FAF8F5] overflow-hidden">
      {/* Outer subtle frame wrapper background */}
      <div className="absolute inset-0 bg-[#F4F1EC] pointer-events-none" />

      {/* Container for the background image and glass card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-[400px] h-full max-h-[850px] flex items-center justify-center z-10"
      >
        <img
          src="/01_splash_background.png"
          alt="Splash Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[8px]"
        />

        {/* Centered Frosted Glassmorphism Branding Card */}
        <motion.div
          id="brand-card"
          initial={{ opacity: 0, scale: 0.93, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 70, damping: 15 }}
          className="absolute w-[82%] max-w-[305px] left-[9%] top-[48%] -translate-y-1/2 bg-[#FAF6F2]/82 backdrop-blur-[14px] border border-white/45 shadow-[0_16px_48px_rgba(78,62,52,0.14)] rounded-[28px] px-6 py-8 text-center flex flex-col items-center justify-center z-30 select-none"
        >
          <h1 id="brand-logo" className="font-serif font-bold tracking-[0.18em] text-[#2C211A] leading-tight flex flex-col items-center justify-center">
            <span className="text-[28px] tracking-[0.24em] font-bold block translate-x-[0.12em]">
              NEXUS
            </span>
            <span className="text-[21px] tracking-[0.32em] font-medium block mt-1.5 translate-x-[0.16em] text-[#55453B]">
              PLANNER
            </span>
          </h1>
          
          <p id="brand-tagline" className="text-[10px] font-sans tracking-[0.15em] uppercase text-[#6C5F54] font-semibold mt-4.5 mb-6 opacity-95">
            Your AI Productivity Companion
          </p>

          {/* Small inner bordered framed container */}
          <div id="brand-quote" className="border border-[#8B7355]/25 rounded-[16px] py-4.5 px-5 bg-[#FAF6F0]/50 w-full max-w-[225px] mx-auto text-center shadow-xs">
            <div className="space-y-1.5 font-serif italic text-[#80614C] text-[13px] leading-relaxed">
              <p className="tracking-wide">Plan gently.</p>
              <p className="tracking-wide">Focus deeply.</p>
              <p className="tracking-wide">
                Achieve daily. <span className="not-italic text-[#705542] ml-0.5 text-[11px] select-none">♡</span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
