import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, Mail, CheckCircle2, RefreshCw } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotInput = z.infer<typeof forgotSchema>;

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBackToLogin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotInput) => {
    setIsLoading(true);
    setError(null);
    setSubmittedEmail(data.email);
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errMsg = 'Failed to send reset email. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errMsg = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-full py-8 px-6 bg-brand-bg text-brand-mocha-dark flex flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Header arrow */}
      <div className="z-10 flex items-center justify-between">
        <button
          onClick={onBackToLogin}
          className="p-2 -ml-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="forgot-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-brand-mocha-dark" />
        </button>
      </div>

      {/* Content wrapper */}
      <div className="my-auto flex flex-col justify-center space-y-6 z-10 py-4">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-left space-y-1">
                <h2 className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide">
                  Forgot Password
                </h2>
                <p className="text-xs text-brand-mocha-dark/70 font-sans leading-relaxed">
                  Enter your registered email address and we'll send you recovery instructions.
                </p>
              </div>

              {/* Input Card */}
              <div className="glass-card p-6 rounded-2xl shadow-xl border border-white/60 custom-shadow flex flex-col gap-4">
                {error && (
                  <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-lg font-sans">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mocha-dark/85 font-sans">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="youremail@gmail.com"
                        {...register('email')}
                        className={`w-full px-4 py-3 pl-10 rounded-xl border bg-white/70 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                          errors.email
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-brand-mocha/20 focus:border-brand-mocha'
                        }`}
                        disabled={isLoading}
                        id="forgot-email-input"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mocha/50" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 mt-2 bg-brand-mocha text-white rounded-xl text-sm font-medium tracking-wide shadow-md shadow-brand-mocha/15 hover:bg-brand-mocha-dark transition-all flex items-center justify-center gap-2"
                    id="forgot-submit-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-animation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Beautiful check animation */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Circular wave animations */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  className="absolute w-16 h-16 rounded-full bg-brand-sage/20 border border-brand-sage/30"
                />
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1.1 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2, ease: 'easeInOut' }}
                  className="absolute w-20 h-20 rounded-full bg-brand-cream border border-brand-sage/20 shadow-inner"
                />
                <div className="absolute w-16 h-16 rounded-full bg-[#E8ECE9] flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-10 h-10 text-brand-sage-dark" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-serif font-semibold text-[#4E3E34]">
                  Reset Link Sent!
                </h3>
                <p className="text-xs text-brand-mocha-dark/80 font-sans leading-relaxed">
                  We have sent a secure password recovery link to:
                  <span className="block font-semibold text-[#4E3E34] mt-1">{submittedEmail}</span>
                </p>
                <p className="text-[11px] text-brand-mocha-dark/50 font-sans">
                  Please click the link in your email inbox to update your password.
                </p>
              </div>

              {/* Next Steps Buttons */}
              <div className="w-full max-w-xs space-y-3 pt-4">
                <button
                  onClick={onBackToLogin}
                  className="w-full py-2.5 text-xs font-semibold text-brand-mocha hover:text-brand-mocha-dark hover:underline focus:outline-none transition-all"
                  id="forgot-go-to-login-btn"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ForgotPasswordScreen;
