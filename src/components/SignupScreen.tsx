import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Eye, EyeOff, Loader2, ArrowLeft, Camera, X } from 'lucide-react';
import { FloralDecoration } from './Illustrations';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms & Conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupInput = z.infer<typeof signupSchema>;

interface SignupScreenProps {
  onSuccess: (user: any, details: { fullName: string; email: string }) => void;
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      const user = await googleLogin();
      onSuccess(user, { fullName: user.displayName || 'Google Member', email: user.email || '' });
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  // Profile picture states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // 1. Upload Profile Picture if selected
      let photoURL = '';
      if (selectedImage) {
        try {
          const imageRef = ref(storage, `profile_pictures/pending_${Date.now()}`);
          const snapshot = await uploadBytes(imageRef, selectedImage);
          photoURL = await getDownloadURL(snapshot.ref);
        } catch (uploadErr) {
          console.error('Error uploading image to storage:', uploadErr);
        }
      }

      // 2. Call Auth Context Signup
      const user = await signup(data.email, data.password, data.fullName, photoURL);

      onSuccess(user, { fullName: data.fullName, email: data.email });
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      const errString = `${error.code || ''} ${error.message || ''}`;
      if (errString.includes('email-already-in-use')) {
        errorMessage = 'An account with this email already exists.';
      } else if (errString.includes('invalid-email')) {
        errorMessage = 'Please provide a valid email address.';
      } else if (errString.includes('operation-not-allowed')) {
        errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
      } else if (errString.includes('weak-password')) {
        errorMessage = 'The password is too weak.';
      }
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-full py-6 px-6 bg-brand-bg text-brand-mocha-dark flex flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Decorative floral branches peeking out of the left side */}
      <div className="absolute top-[80px] left-0 pointer-events-none select-none z-0 overflow-hidden w-28 h-40">
        <FloralDecoration className="absolute -top-4 -left-10 w-44 h-44 opacity-60 transform -rotate-12" />
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={onNavigateToLogin}
          className="p-2 -ml-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="signup-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-brand-mocha-dark" />
        </button>
        <button
          onClick={onNavigateToLogin}
          className="p-2 -mr-2 rounded-full hover:bg-brand-cream/60 transition-colors"
          id="signup-close-btn"
        >
          <X className="w-5 h-5 text-brand-mocha-dark" />
        </button>
      </div>

      {/* Title */}
      <div className="mt-4 mb-2 text-center z-10">
        <h2 className="text-3xl font-serif font-semibold text-[#4E3E34] tracking-wide">
          Create Account
        </h2>
        <p className="text-sm text-brand-mocha-dark/70 font-sans mt-0.5">Let's begin your journey</p>
      </div>

      {/* Form Card (now just layout, no glass card) */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="z-10 flex flex-col gap-4 my-auto mt-2"
      >
        {authError && (
          <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-lg font-sans">
            {authError}
          </div>
        )}

        {/* Profile Image Picker Placeholder */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative cursor-pointer group" onClick={triggerFileInput}>
            <div className="w-20 h-20 rounded-full bg-[#E8E2D9] flex items-center justify-center overflow-hidden transition-all duration-300">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-[#4E3E34]/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            {/* Camera Overlay Icon */}
            <div className="absolute bottom-0 -right-1 p-1.5 bg-[#8DA5B7] text-white rounded-full shadow-sm">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="signup-file-input"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#4E3E34]/80 font-sans pl-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Kashak Singh"
              {...register('fullName')}
              className={`w-full px-4 py-3 rounded-[12px] border bg-white/75 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-[#9B7861]/20 focus:border-[#9B7861]'
              }`}
              disabled={isLoading}
              id="signup-name-input"
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-500 font-medium pl-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#4E3E34]/80 font-sans pl-1">
              Email
            </label>
            <input
              type="email"
              placeholder="youremail@gmail.com"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-[12px] border bg-white/75 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                errors.email ? 'border-red-300 focus:border-red-500' : 'border-[#9B7861]/20 focus:border-[#9B7861]'
              }`}
              disabled={isLoading}
              id="signup-email-input"
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#4E3E34]/80 font-sans pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full pl-4 pr-10 py-2.5 rounded-xl border bg-white/75 text-[#4E3E34] text-sm focus:outline-none transition-all ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-brand-mocha/20 focus:border-brand-mocha'
                }`}
                disabled={isLoading}
                id="signup-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-mocha hover:text-brand-mocha-dark"
                id="signup-toggle-password-btn"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium pl-1 leading-tight">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
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
                  errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-[#9B7861]/20 focus:border-[#9B7861]'
                }`}
                disabled={isLoading}
                id="signup-confirm-password-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#9B7861] hover:text-[#7D5A44]"
                id="signup-toggle-confirm-password-btn"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium pl-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="space-y-0.5 py-1 px-1 mt-1">
            <label className="flex items-start space-x-2 text-xs font-sans text-[#4E3E34]/80 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('agreeTerms')}
                className="w-4 h-4 mt-0.5 rounded-[4px] border-[#9B7861]/40 text-[#9B7861] focus:ring-[#9B7861]/30 bg-[#9B7861]/10 accent-[#9B7861]"
                id="signup-terms-checkbox"
              />
              <span className="leading-tight text-[11px] font-medium">
                I agree to the <span className="font-semibold text-[#4E3E34]">Terms & Conditions</span>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-[11px] text-red-500 font-medium pl-1">{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Create Account button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 mt-2 bg-[#9B7861] text-white rounded-[14px] text-sm font-semibold tracking-wide hover:bg-[#8A6852] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(155,120,97,0.25)]"
            id="signup-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
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
            id="signup-google-btn"
            title="Sign up with Google"
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
            id="signup-apple-btn"
            title="Sign up with Apple"
          >
            <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.15.67-2.87 1.51-.62.72-1.16 1.86-1.02 2.97 1.12.09 2.2-.55 2.9-1.42" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer link */}
      <div className="text-center text-xs font-sans mt-3 z-10">
        <p className="text-brand-mocha-dark/60">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-semibold text-brand-mocha hover:text-brand-mocha-dark hover:underline transition-all"
            id="signup-login-link"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
export default SignupScreen;
