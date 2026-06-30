import React from 'react';
import { motion } from 'motion/react';
import { VaseFlowers } from './Illustrations';

interface ResetSuccessScreenProps {
  onGoToLogin: () => void;
}

export const ResetSuccessScreen: React.FC<ResetSuccessScreenProps> = ({ onGoToLogin }) => {
  return (
    <div className="relative flex flex-col justify-between min-h-full py-12 px-6 bg-brand-bg text-brand-mocha-dark overflow-hidden font-sans">
      {/* Title block */}
      <div className="text-center space-y-2 mt-4">
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide"
        >
          Password Reset
          <span className="block mt-1">
            Successful!
          </span>
        </motion.h2>
      </div>

      {/* Center Illustration */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}
        className="my-auto flex items-center justify-center py-6"
      >
        <img src="/09_success_cup.png" alt="Success Cup" className="w-[260px] h-[260px] object-contain select-none pointer-events-none mix-blend-multiply" />
      </motion.div>

      {/* Subtitle and button */}
      <div className="flex flex-col items-center space-y-6">
        <p className="text-[13px] text-[#4E3E34]/80 font-sans leading-relaxed text-center max-w-[260px]">
          You can now login with your new password.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoToLogin}
          className="w-full max-w-[280px] py-3.5 bg-[#8EA2B4] text-white rounded-[14px] text-sm font-semibold hover:bg-[#7D91A3] transition-all flex items-center justify-center"
          id="reset-success-login-btn"
        >
          Go to Login
        </motion.button>
      </div>
    </div>
  );
};
export default ResetSuccessScreen;
