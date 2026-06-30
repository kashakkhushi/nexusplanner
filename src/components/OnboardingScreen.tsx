import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
  onBackToLogin?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onBackToLogin }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Plan beautifully.\nAchieve effortlessly.',
      subtitle: 'Smart planning, mindful focus, and AI guidance in one place.',
      image: '/02_onboarding_01.png',
    },
    {
      title: 'Focus better.\nStress less.',
      subtitle: 'Stay consistent with focus tools and habit tracking.',
      image: '/03_onboarding_02.png',
    },
    {
      title: 'Grow every day.\nBecome your best self.',
      subtitle: 'Track habits, reflect, and celebrate small wins.',
      image: '/04_onboarding_03.png',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      if (onBackToLogin) onBackToLogin();
    }
  };

  return (
    <div className="relative flex flex-col justify-between min-h-full py-8 px-6 bg-[#FCFAF7] text-[#2C211A] overflow-hidden font-sans">
      {/* Header bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#EADECF]/30 transition-colors text-[#6C5F55]"
          id="onboarding-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-[#6C5F55]" />
        </button>
        <button
          onClick={onComplete}
          className="text-xs tracking-widest uppercase text-[#B08B74] hover:text-[#9B7861] transition-colors font-bold font-sans"
          id="onboarding-skip-btn"
        >
          SKIP
        </button>
      </div>

      {/* Main Content Carousel */}
      <div className="flex-grow flex flex-col justify-center my-4 relative">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#2C211A] leading-tight whitespace-pre-line min-h-[72px] flex items-center justify-center">
            {pages[currentPage].title}
          </h2>

          {/* Illustration */}
          <div className="w-[320px] h-[320px] flex items-center justify-center select-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-sm bg-white overflow-hidden p-1">
            <img src={pages[currentPage].image} alt="Onboarding illustration" className="w-full h-full object-cover" />
          </div>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-[#6C5F55] leading-relaxed max-w-[290px] min-h-[44px] px-1 font-sans">
            {pages[currentPage].subtitle}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          {/* Indicators - pill shape for active, circle for inactive */}
          <div className="flex space-x-2 items-center pl-1">
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage ? 'w-6 bg-[#9B7861]' : 'w-2 bg-[#EADECF]'
                }`}
              />
            ))}
          </div>

          {/* Action Button - Next or Get Started */}
          {currentPage === pages.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-8 py-3 bg-[#9B7861] text-white border-2 border-[#2C211A] rounded-[14px] text-sm font-bold hover:bg-[#8A6852] transition-all cursor-pointer font-sans tracking-wide"
              id="onboarding-get-started-btn"
            >
              Get Started
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-8 py-3 bg-[#8EA2B4] text-white rounded-[14px] text-sm font-bold hover:bg-[#7D91A3] transition-all cursor-pointer font-sans tracking-wide"
              id="onboarding-next-btn"
            >
              Next
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingScreen;
