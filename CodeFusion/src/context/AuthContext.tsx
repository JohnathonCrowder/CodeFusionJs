import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Updated interfaces
interface UsageQuota {
  uploadsToday: number;
  uploadsThisMonth: number;
  maxUploadsPerDay: number;
  maxUploadsPerMonth: number;
  maxFileSize: number; // in bytes
  maxFilesPerDirectory: number;
  lastResetDate: string; // YYYY-MM-DD format
}

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  // New subscription fields
  subscriptionTier: 'free' | 'pro' | 'team' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'canceled';
  subscriptionExpiry?: Date;
  usageQuota: UsageQuota;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
  canUpload: (fileSize?: number) => boolean;
  trackUpload: () => Promise<boolean>;
  getRemainingUploads: () => number;
  upgradeTo: (tier: 'pro' | 'team' | 'enterprise') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Subscription tier configurations
const SUBSCRIPTION_CONFIGS = {
  free: {
    maxUploadsPerDay: 10,
    maxUploadsPerMonth: 200,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFilesPerDirectory: 50
  },
  pro: {
    maxUploadsPerDay: 100,
    maxUploadsPerMonth: 2000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFilesPerDirectory: 500
  },
  team: {
    maxUploadsPerDay: 500,
    maxUploadsPerMonth: 10000,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFilesPerDirectory: 1000
  },
  enterprise: {
    maxUploadsPerDay: -1, // unlimited
    maxUploadsPerMonth: -1, // unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxFilesPerDirectory: 5000
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get today's date string
  const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper function to reset daily quota if needed
  const resetDailyQuotaIfNeeded = (quota: UsageQuota): UsageQuota => {
    const today = getTodayString();
    if (quota.lastResetDate !== today) {
      return {
        ...quota,
        uploadsToday: 0,
        lastResetDate: today
      };
    }
    return quota;
  };

  // Create default quota for a subscription tier
  const createDefaultQuota = (tier: string): UsageQuota => {
    const config = SUBSCRIPTION_CONFIGS[tier as keyof typeof SUBSCRIPTION_CONFIGS];
    return {
      uploadsToday: 0,
      uploadsThisMonth: 0,
      maxUploadsPerDay: config.maxUploadsPerDay,
      maxUploadsPerMonth: config.maxUploadsPerMonth,
      maxFileSize: config.maxFileSize,
      maxFilesPerDirectory: config.maxFilesPerDirectory,
      lastResetDate: getTodayString()
    };
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        // Reset daily quota if needed
        const updatedQuota = resetDailyQuotaIfNeeded(data.usageQuota);
        
        if (updatedQuota !== data.usageQuota) {
          // Update the document if quota was reset
          await updateDoc(docRef, { usageQuota: updatedQuota });
          return { ...data, usageQuota: updatedQuota };
        }
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (user: User, displayName?: string): Promise<void> => {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.email!.split('@')[0],
      role: 'user',
      createdAt: new Date(),
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      usageQuota: createDefaultQuota('free')
    };

    await setDoc(doc(db, 'users', user.uid), profile);
    setUserProfile(profile);
  };

  // Check if user can upload
  const canUpload = (fileSize?: number): boolean => {
    if (!userProfile) return false;

    const quota = userProfile.usageQuota;
    
    // Check daily limit (unless unlimited)
    if (quota.maxUploadsPerDay !== -1 && quota.uploadsToday >= quota.maxUploadsPerDay) {
      return false;
    }

    // Check monthly limit (unless unlimited)
    if (quota.maxUploadsPerMonth !== -1 && quota.uploadsThisMonth >= quota.maxUploadsPerMonth) {
      return false;
    }

    // Check file size if provided
    if (fileSize && fileSize > quota.maxFileSize) {
      return false;
    }

    return true;
  };

  // Track an upload
  const trackUpload = async (): Promise<boolean> => {
    if (!userProfile || !canUpload()) return false;

    try {
      const userDoc = doc(db, 'users', userProfile.uid);
      
      // Update both daily and monthly counters
      await updateDoc(userDoc, {
        'usageQuota.uploadsToday': increment(1),
        'usageQuota.uploadsThisMonth': increment(1)
      });

      // Update local state
      setUserProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          usageQuota: {
            ...prev.usageQuota,
            uploadsToday: prev.usageQuota.uploadsToday + 1,
            uploadsThisMonth: prev.usageQuota.uploadsThisMonth + 1
          }
        };
      });

      return true;
    } catch (error) {
      console.error('Error tracking upload:', error);
      return false;
    }
  };

  // Get remaining uploads for today
  const getRemainingUploads = (): number => {
    if (!userProfile) return 0;
    
    const quota = userProfile.usageQuota;
    if (quota.maxUploadsPerDay === -1) return 999; // unlimited
    
    return Math.max(0, quota.maxUploadsPerDay - quota.uploadsToday);
  };

  // Manually upgrade user (admin function, later will integrate with payment)
  const upgradeTo = async (tier: 'pro' | 'team' | 'enterprise'): Promise<void> => {
    if (!currentUser) return;

    const newQuota = createDefaultQuota(tier);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscriptionExpiry: expiryDate,
        usageQuota: {
          ...newQuota,
          uploadsToday: userProfile?.usageQuota.uploadsToday || 0,
          uploadsThisMonth: userProfile?.usageQuota.uploadsThisMonth || 0
        }
      });

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          subscriptionTier: tier,
          subscriptionStatus: 'active',
          subscriptionExpiry: expiryDate,
          usageQuota: {
            ...newQuota,
            uploadsToday: userProfile.usageQuota.uploadsToday,
            uploadsThisMonth: userProfile.usageQuota.uploadsThisMonth
          }
        });
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  };

  // Sign up function
  const signup = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user, displayName);
  };

  // Login function
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Password reset function
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Check if user is admin
  const isAdmin = userProfile?.role === 'admin';

  // Check if user has premium features
  const isPremium = userProfile?.subscriptionTier !== 'free';

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    isAdmin,
    isPremium,
    canUpload,
    trackUpload,
    getRemainingUploads,
    upgradeTo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};