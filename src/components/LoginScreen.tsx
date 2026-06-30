import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { FloralDecoration } from './Illustrations';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  onSuccess: (user: any) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgot: () => void;
  onNavigateToOnboarding: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onNavigateToSignup,
  onNavigateToForgot,
  onNavigateToOnboarding,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await login(data.email, data.password, data.rememberMe);
      onSuccess(user);
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      const errString = `${error.code || ''} ${error.message || ''}`;
      if (errString.includes('wrong-password') || errString.includes('invalid-credential')) {
        errorMessage = 'Invalid login details. Please verify your email and password.';
      } else if (errString.includes('user-not-found')) {
        errorMessage = 'No account found with this email.';
      } else if (errString.includes('too-many-requests')) {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      const user = await googleLogin();
      onSuccess(user);
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-full py-8 px-6 bg-brand-bg text-brand-mocha-dark flex flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Decorative floral branches peeking out of the right side */}
      <div className="absolute top-[60px] right-0 pointer-events-none select-none z-0 overflow-hidden w-32 h-40">
        <FloralDecoration className="absolute -top-4 -right-8 w-48 h-48 opacity-70 transform rotate-12 scale-x-[-1]" />
      </div>

      {/* Header arrow */}
      <div className="z-10 flex items-center justify-between">
        <button
          onClick={onNavigateToOnboarding}
          className="p-2 -ml-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="login-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-brand-mocha-dark" />
        </button>
      </div>

      {/* Title block */}
      <div className="mt-6 mb-4 text-left z-10">
        <h2 className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide flex items-center gap-1.5">
          Welcome Back <span className="text-brand-mocha">♡</span>
        </h2>
        <p className="text-sm text-brand-mocha-dark/70 font-sans mt-1">Glad to see you again!</p>
      </div>

      {/* Main layout */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="z-10 my-auto flex flex-col gap-5 mt-2"
      >
        {authError && (
          <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-lg font-sans leading-relaxed">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#4E3E34]/80 font-sans pl-1">
              Email
            </label>
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <input
                type="email"
                placeholder="youremail@gmail.com"
                {...register('email')}
                className={`w-full px-4 py-3.5 rounded-[14px] border bg-white/70 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-[#9B7861]/20 focus:border-[#9B7861] focus:ring-1 focus:ring-[#9B7861]/20'
                }`}
                disabled={isLoading}
                id="login-email-input"
              />
            </motion.div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#4E3E34]/80 font-sans pl-1">
              Password
            </label>
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full pl-4 pr-10 py-3.5 rounded-[14px] border bg-white/70 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-[#9B7861]/20 focus:border-[#9B7861] focus:ring-1 focus:ring-[#9B7861]/20'
                }`}
                disabled={isLoading}
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#9B7861] hover:text-[#7D5A44]"
                id="login-toggle-password-btn"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password links */}
          <div className="flex items-center justify-between text-xs font-sans py-1 px-1 mt-1">
            <label className="flex items-center space-x-2 text-[#4E3E34]/80 select-none cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded-[4px] border-[#9B7861]/40 text-[#9B7861] focus:ring-[#9B7861]/30 bg-[#9B7861]/10 accent-[#9B7861]"
                id="login-remember-me-checkbox"
              />
              <span className="font-medium text-[11px]">Remember me</span>
            </label>
            <button
              type="button"
              onClick={onNavigateToForgot}
              className="font-medium text-[#4E3E34]/80 hover:text-[#4E3E34] transition-colors text-[11px]"
              id="login-forgot-password-link"
            >
              Forget Password?
            </button>
          </div>

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 mt-4 bg-[#9B7861] text-white rounded-[14px] text-sm font-semibold tracking-wide hover:bg-[#8A6852] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(155,120,97,0.25)]"
            id="login-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-brand-mocha/10"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-brand-mocha-dark/40 font-mono">
            or continue with
          </span>
          <div className="flex-grow border-t border-brand-mocha/10"></div>
        </div>

        {/* Social logins - elegant buttons as shown in mockup */}
        <div className="flex justify-center items-center gap-4 py-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="flex items-center justify-center flex-1 h-12 border border-brand-mocha/15 bg-white hover:bg-[#FAF6F0] rounded-xl shadow-xs transition-all cursor-pointer"
            id="login-google-btn"
            title="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          </motion.button>
 
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center flex-1 h-12 border border-brand-mocha/15 bg-white hover:bg-[#FAF6F0] rounded-xl shadow-xs cursor-pointer transition-all"
            onClick={() => setAuthError('Apple Authentication is coming soon on Web!')}
            id="login-apple-btn"
            title="Sign in with Apple"
          >
            <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.15.67-2.87 1.51-.62.72-1.16 1.86-1.02 2.97 1.12.09 2.2-.55 2.9-1.42" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer link */}
      <div className="text-center text-xs font-sans mt-4 z-10">
        <p className="text-brand-mocha-dark/60">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToSignup}
            className="font-semibold text-brand-mocha hover:text-brand-mocha-dark hover:underline transition-all"
            id="login-signup-link"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
export default LoginScreen;
