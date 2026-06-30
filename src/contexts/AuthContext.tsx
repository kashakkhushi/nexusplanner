import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;
  toasts: ToastMessage[];
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  signup: (email: string, password: string, fullName: string, photoURL?: string) => Promise<User>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  confirmReset: (oobCode: string, newPassword: string) => Promise<void>;
  verifyResetCode: (oobCode: string) => Promise<string>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Management Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500); // Elegant timing for readability
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile refresher
  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      return;
    }
    const path = `users/${auth.currentUser.uid}`;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfile);
      }
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      handleFirestoreError(err, OperationType.GET, path);
    }
  };

  // Sync auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const path = `users/${currentUser.uid}`;
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          
          // Immediate profile update using setDoc with { merge: true }
          const updatedFields = {
            lastLogin: new Date().toISOString(),
            provider: currentUser.providerData?.[0]?.providerId || 'password',
            uid: currentUser.uid,
          };
          
          await setDoc(docRef, updatedFields, { merge: true });
          
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            // Fallback profile if it doesn't exist
            const fallbackProfile: UserProfile = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || 'Nexus Member',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' + encodeURIComponent(currentUser.displayName || 'Nexus Member'),
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              emailVerified: currentUser.emailVerified,
              provider: currentUser.providerData?.[0]?.providerId || 'password',
              level: 1,
              xp: 0,
              preferences: {},
            };
            await setDoc(docRef, fallbackProfile, { merge: true });
            setUserProfile(fallbackProfile);
          }
        } catch (err) {
          console.error('Error fetching/setting Firestore user profile on auth change:', err);
          try {
            handleFirestoreError(err, OperationType.GET, path);
          } catch (e) {
            // Log it but let state finish loading
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Standard Login
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<User> => {
    // Set persistence before login
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;

    // Update lastLogin on login, using merge to avoid wiping profile pictures or custom info
    const docRef = doc(db, 'users', u.uid);
    const path = `users/${u.uid}`;
    try {
      await setDoc(
        docRef,
        {
          lastLogin: new Date().toISOString(),
          provider: u.providerData?.[0]?.providerId || 'password',
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    // Refresh local profile state immediately
    await refreshProfile();
    addToast('Welcome back to Nexus! ♡', 'success');
    return u;
  };

  // Standard Signup
  const signup = async (email: string, password: string, fullName: string, photoURL?: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;

    // Set Display Name and Photo URL in auth profile
    const finalPhotoURL = photoURL || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' + encodeURIComponent(fullName);
    await updateProfile(u, {
      displayName: fullName,
      photoURL: finalPhotoURL,
    });

    // Generate Verification OTP and expirations
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

    // Save profile to Firestore with merge protection
    const docRef = doc(db, 'users', u.uid);
    const path = `users/${u.uid}`;
    let snapshot;
    try {
      snapshot = await getDoc(docRef);
    } catch (err) {
      console.warn('Error reading user profile during signup, assuming non-existent:', err);
    }

    const isBrandNew = !snapshot?.exists();

    const profile: Partial<UserProfile> & { [key: string]: any } = {
      uid: u.uid,
      fullName,
      email,
      photoURL: finalPhotoURL,
      lastLogin: new Date().toISOString(),
      otpCode,
      otpExpiresAt,
      emailVerified: false,
      provider: 'password',
      level: 1,
      xp: 0,
      preferences: {},
    };

    if (isBrandNew) {
      profile.createdAt = new Date().toISOString();
    }

    try {
      await setDoc(docRef, profile, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    
    // Also send standard Firebase verification link as fallback
    try {
      await sendEmailVerification(u);
      console.log('Firebase verification email sent successfully.');
    } catch (err) {
      console.warn('Firebase sendEmailVerification warning:', err);
    }

    console.log(`[TESTING OTP] Code generated for registration: ${otpCode}`);

    await refreshProfile();
    addToast('Account created successfully! Verification sent.', 'success');
    return u;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    addToast('Signed out of your session.', 'info');
  };

  // Google Sign In
  const googleLogin = async (): Promise<User> => {
    let result;
    try {
      // Try standard popup first
      result = await signInWithPopup(auth, googleProvider);
    } catch (popupError: any) {
      console.warn('Popup blocked/failed, trying redirect fallback...', popupError);
      // Let standard sign in with popup error raise unless it's a closed event, or try redirect.
      // Since it's in an iframe preview, popup-closed or blocked are common.
      // We raise popupError to UI so the UI can decide to retry or report.
      throw popupError;
    }

    const u = result.user;
    const docRef = doc(db, 'users', u.uid);
    const path = `users/${u.uid}`;
    
    let snapshot;
    try {
      snapshot = await getDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }

    if (!snapshot.exists()) {
      // Create new Firestore document for new Google users
      const newProfile: UserProfile = {
        uid: u.uid,
        fullName: u.displayName || 'Google Member',
        email: u.email || '',
        photoURL: u.photoURL || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' + encodeURIComponent(u.displayName || 'Google Member'),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: true, // Google accounts are verified
        provider: 'google.com',
        level: 1,
        xp: 0,
        preferences: {},
      };
      try {
        await setDoc(docRef, newProfile, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    } else {
      // Just update lastLogin for existing users
      try {
        await setDoc(
          docRef,
          {
            lastLogin: new Date().toISOString(),
            emailVerified: true, // Mark verified if logging in via verified provider
            provider: 'google.com',
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }

    await refreshProfile();
    addToast(`Connected beautifully via Google!`, 'success');
    return u;
  };

  // Reset Password (send link)
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    addToast('Password reset link sent to your email.', 'success');
  };

  // Send Firebase standard verification email manually
  const sendVerification = async () => {
    if (!auth.currentUser) throw new Error('No user currently logged in');
    await sendEmailVerification(auth.currentUser);
    addToast('Verification email resent successfully.', 'info');
  };

  // Confirm Reset with code
  const confirmReset = async (oobCode: string, newPassword: string) => {
    await confirmPasswordReset(auth, oobCode, newPassword);
    addToast('Password has been reset successfully!', 'success');
  };

  // Verify Reset Code validity
  const verifyResetCodeValue = async (oobCode: string): Promise<string> => {
    const email = await verifyPasswordResetCode(auth, oobCode);
    return email;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isInitialized,
        toasts,
        login,
        signup,
        logout,
        googleLogin,
        resetPassword,
        sendVerification,
        confirmReset,
        verifyResetCode: verifyResetCodeValue,
        addToast,
        removeToast,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
