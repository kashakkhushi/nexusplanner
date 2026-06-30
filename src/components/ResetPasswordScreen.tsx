import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';
import { FloralDecoration } from './Illustrations';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordScreenProps {
  email: string;
  oobCode?: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  email: initialEmail,
  oobCode,
  onSuccess,
  onBack,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [displayEmail, setDisplayEmail] = useState<string>(initialEmail);

  const { confirmReset, verifyResetCode, addToast } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Watch the password field for live validation
  const watchedPassword = watch('password') || '';

  // Validate the reset code on mount if present
  useEffect(() => {
    if (oobCode) {
      setIsLoading(true);
      verifyResetCode(oobCode)
        .then((emailAddress) => {
          setDisplayEmail(emailAddress);
          addToast('Action link verified successfully.', 'success');
        })
        .catch((err: any) => {
          console.error('Verify reset code error:', err);
          setApiError('The action link is invalid, expired, or has already been used.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [oobCode]);

  // Password criteria check - exactly matching Panel 8 of mockup
  const validationCriteria = [
    { label: '8+ characters', test: (p: string) => p.length >= 8 },
    { label: '1 number', test: (p: string) => /[0-9]/.test(p) },
    { label: '1 special character', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
  ];

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setApiError(null);
    try {
      if (oobCode) {
        await confirmReset(oobCode, data.password);
      } else {
        // If no oobCode (e.g. testing/inline mockup flow)
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      onSuccess();
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errMsg = 'Failed to reset password. Please try again.';
      if (err.code === 'auth/expired-action-code') {
        errMsg = 'The link has expired. Please request a new one.';
      } else if (err.code === 'auth/invalid-action-code') {
        errMsg = 'The link is invalid. It may have already been used.';
      }
      setApiError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-full py-8 px-6 bg-brand-bg text-brand-mocha-dark flex flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Header arrow */}
      <div className="z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="reset-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-brand-mocha-dark" />
        </button>
      </div>

      {/* Main Form content */}
      <div className="my-auto flex flex-col justify-center space-y-5 z-10 py-4">
        <div className="text-left space-y-1">
          <h2 className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide">
            Reset Password
          </h2>
          <p className="text-[13px] text-[#4E3E34]/70 font-sans leading-relaxed">
            Almost there! Set your new password
          </p>
        </div>

        {/* Input layout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col gap-4 mt-2"
        >
          {apiError && (
            <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-lg font-sans">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#4E3E34]/80 font-sans pl-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-4 pr-10 py-3 rounded-[12px] border bg-white/75 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-[#9B7861]/20 focus:border-[#9B7861]'
                  }`}
                  disabled={isLoading}
                  id="reset-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#9B7861] hover:text-[#7D5A44]"
                  id="reset-toggle-password-btn"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#4E3E34]/80 font-sans pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-4 pr-10 py-3 rounded-[12px] border bg-white/75 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-[#9B7861]/20 focus:border-[#9B7861]'
                  }`}
                  disabled={isLoading}
                  id="reset-confirm-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#9B7861] hover:text-[#7D5A44]"
                  id="reset-toggle-confirm-btn"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 font-medium pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Live password requirements indicators */}
            <div className="space-y-1 pt-1 pb-2 px-1">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {validationCriteria.map((criterion, idx) => {
                  const isMet = criterion.test(watchedPassword);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 text-[11px] font-sans transition-colors duration-300 ${
                        isMet ? 'text-[#8EA2B4] font-medium' : 'text-[#4E3E34]/50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isMet ? 'bg-[#8EA2B4] text-white scale-110' : 'bg-[#4E3E34]/10 text-[#4E3E34]/40'
                        }`}
                      >
                        {isMet ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                      <span>{criterion.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Password button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-[#9B7861] text-white rounded-[14px] text-sm font-semibold tracking-wide hover:bg-[#8A6852] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(155,120,97,0.25)]"
              id="reset-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Decorative floral branches peeking out of the bottom right side */}
      <div className="w-full flex justify-end mt-auto pt-4 pointer-events-none select-none z-0 overflow-hidden h-32 relative">
        <FloralDecoration className="absolute -bottom-8 -right-8 w-56 h-56 opacity-80 transform -rotate-12" />
      </div>
    </div>
  );
};
export default ResetPasswordScreen;
