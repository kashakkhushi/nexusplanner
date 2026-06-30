import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, X, Loader2, CheckCircle2 } from 'lucide-react';
import { OtpEnvelope } from './Illustrations';

interface VerifyOtpScreenProps {
  email: string;
  userId: string;
  onSuccess: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  email,
  userId,
  onSuccess,
  onBack,
  onClose,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(25); // 25 seconds countdown like reference
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentOtpCode, setCurrentOtpCode] = useState<string>('');
  const [showResendSuccess, setShowResendSuccess] = useState(false);

  const { refreshProfile } = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Fetch current OTP code from Firestore for the testing alert banner
  const fetchCurrentOtp = async () => {
    const path = `users/${userId}`;
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.otpCode) {
          setCurrentOtpCode(data.otpCode);
        }
      }
    } catch (err) {
      console.error('Error fetching OTP from Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Just log the error info object in console, don't crash OTP banner fetching
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCurrentOtp();
    }
  }, [userId]);

  // 2. Timer Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 3. Handle key inputs & navigation
  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Focus next box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If fully filled, auto-validate!
    const completedOtp = newOtp.join('');
    if (completedOtp.length === 6) {
      validateOtp(completedOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setError(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    setError(null);
    inputRefs.current[5]?.focus();
    validateOtp(pastedData);
  };

  // 4. Validate OTP from Firestore
  const validateOtp = async (code: string) => {
    setIsValidating(true);
    setError(null);
    const path = `users/${userId}`;
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const storedCode = userData.otpCode;
        const expiresAt = userData.otpExpiresAt;

        if (storedCode === code) {
          if (new Date() > new Date(expiresAt)) {
            setError('This code has expired. Please click resend.');
          } else {
            // Success! Update verification status
            try {
              await setDoc(
                userDocRef,
                {
                  emailVerified: true,
                  otpCode: null, // Clear the code once verified
                  otpExpiresAt: null,
                },
                { merge: true }
              );
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, path);
            }
            await refreshProfile();
            onSuccess();
          }
        } else {
          setError('Invalid verification code. Please try again.');
        }
      } else {
        setError('User record not found.');
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      setError('An error occurred. Please try again.');
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log the full formatted error info
      }
    } finally {
      setIsValidating(false);
    }
  };

  // 5. Resend Code Action
  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setShowResendSuccess(false);

    const path = `users/${userId}`;
    try {
      // Generate a new OTP
      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const userDocRef = doc(db, 'users', userId);
      try {
        await setDoc(
          userDocRef,
          {
            otpCode: newOtpCode,
            otpExpiresAt: expiresAt,
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }

      // Reset timer, update state
      setCurrentOtpCode(newOtpCode);
      setOtp(['', '', '', '', '', '']);
      setTimer(25);
      setShowResendSuccess(true);
      setTimeout(() => setShowResendSuccess(false), 4000);
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Format timer text
  const formatTime = (sec: number): string => {
    return `00:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="relative min-h-full py-8 px-6 bg-brand-bg text-brand-mocha-dark flex flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Header bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="otp-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-brand-mocha-dark" />
        </button>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="otp-close-btn"
        >
          <X className="w-5 h-5 text-brand-mocha-dark" />
        </button>
      </div>

      {/* Main Container */}
      <div className="my-auto flex flex-col items-center justify-center space-y-6 z-10 py-4">
        {/* Test Mode Indicator Banner */}
        {currentOtpCode && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-[#EADBC8]/70 border border-[#E1D4C3] p-3 rounded-xl text-center font-sans shadow-sm"
          >
            <p className="text-xs font-semibold text-[#4E3E34] tracking-wide">
              ✏️ [Test Mode] Verification Code
            </p>
            <p className="text-lg font-mono font-bold text-brand-mocha-dark tracking-widest mt-1">
              {currentOtpCode.split('').join(' ')}
            </p>
          </motion.div>
        )}

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide">
            Verify OTP
          </h2>
          <p className="text-xs text-brand-mocha-dark/70 font-sans max-w-xs leading-relaxed">
            Enter the 6-digit code sent to
            <span className="block font-semibold text-brand-mocha mt-0.5">{email}</span>
          </p>
        </div>

        {/* 6 Digit Box Inputs */}
        <div className="flex justify-center gap-2 md:gap-3 w-full py-2">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isValidating}
              className={`w-11 h-14 md:w-12 md:h-16 text-center text-xl font-serif font-semibold rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-mocha/30 focus:border-brand-mocha shadow-sm transition-all ${
                error
                  ? 'border-red-300'
                  : digit
                  ? 'border-brand-mocha text-[#4E3E34]'
                  : 'border-brand-mocha/20'
              }`}
              id={`otp-input-${index}`}
            />
          ))}
        </div>

        {/* Verification Status or Error Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium font-sans text-center"
            >
              {error}
            </motion.p>
          )}

          {isValidating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-brand-mocha font-medium"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying code...
            </motion.div>
          )}

          {showResendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-1.5 justify-center py-1 px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-600 font-sans"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              New code sent successfully! Check banner.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Code countdown */}
        <div className="text-center pt-2">
          {timer > 0 ? (
            <p className="text-xs text-brand-mocha-dark/50 font-sans font-medium">
              Resend code in <span className="font-mono text-brand-mocha">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-xs font-semibold text-brand-mocha hover:text-brand-mocha-dark hover:underline focus:outline-none transition-all flex items-center gap-1 mx-auto"
              id="otp-resend-btn"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </button>
          )}
        </div>

        {/* Envelope Floral Illustration at bottom */}
        <div className="w-full flex justify-center pt-4">
          <img src="/07_otp_envelope.png" alt="OTP Envelope" className="w-[260px] h-auto object-contain pointer-events-none select-none mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};
export default VerifyOtpScreen;
