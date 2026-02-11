
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

import { API_URL, registerLogoutCallback } from '@/lib/api';

import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  location?: string;
  nik?: string;
  regencyId?: string;
  provinceId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Biometric
  isBiometricSupported: boolean;
  isBiometricEnabled: boolean;
  enableBiometric: (password: string) => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  updateBiometricSecret: (password: string) => Promise<void>;
  loginWithBiometric: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Wait until the navigation is ready
    const isNavigationReady = rootNavigationState?.key;
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';

    try {
      if (!user && !inAuthGroup) {
        router.replace('/auth/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)/sppg');
      }
    } catch (e) {
      // Catch navigation context issues during re-renders
      console.warn('Navigation guard error:', e);
    }
  }, [user, segments, rootNavigationState?.key]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Biometric State
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const userData = await SecureStore.getItemAsync('user_data');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
        
        await checkBiometricStatus();
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Register global logout callback
    registerLogoutCallback(signOut);

    loadUser();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);

      // Check if we have stored credentials for this device
      const bioId = await SecureStore.getItemAsync('biometric_id');
      const bioSec = await SecureStore.getItemAsync('biometric_sec');
      
      setIsBiometricEnabled(!!(bioId && bioSec));
    } catch (error) {
      console.log('Biometric check error:', error);
      setIsBiometricSupported(false);
      setIsBiometricEnabled(false);
    }
  };

  const enableBiometric = async (password: string): Promise<boolean> => {
    try {
      if (!user || !user.phoneNumber) throw new Error("User not found");

      // 0. Verify password with API first
      // We use a fresh login attempt to validte credentials
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: user.phoneNumber,
          password: password
        })
      });

      if (!response.ok) {
         // Password incorrect
         return false;
      }

      // 1. Authenticate with Biometric first to confirm user intent/ownership
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifikasi Biometrik untuk Mengaktifkan',
        fallbackLabel: 'Gunakan Kata Sandi' 
      });

      if (!result.success) {
         return false;
      }

      // 2. Store credentials securel
      await SecureStore.setItemAsync('biometric_id', user.phoneNumber);
      await SecureStore.setItemAsync('biometric_sec', password);
      
      setIsBiometricEnabled(true);
      return true;
    } catch (error) {
      console.error("Failed to enable biometric", error);
      return false;
    }
  };

  const disableBiometric = async () => {
    await SecureStore.deleteItemAsync('biometric_id');
    await SecureStore.deleteItemAsync('biometric_sec');
    setIsBiometricEnabled(false);
  };

  const updateBiometricSecret = async (password: string) => {
    try {
        if (isBiometricEnabled) {
            await SecureStore.setItemAsync('biometric_sec', password);
        }
    } catch (error) {
        console.error("Failed to update biometric secret", error);
    }
  };

  const loginWithBiometric = async (): Promise<{ success: boolean; message?: string }> => {
     try {
       // 1. Check if enabled
       const bioId = await SecureStore.getItemAsync('biometric_id');
       const bioSec = await SecureStore.getItemAsync('biometric_sec');
       
       if (!bioId || !bioSec) {
         return { success: false, message: 'Biometrik belum diaktifkan.' };
       }

       // 2. Authenticate
       const result = await LocalAuthentication.authenticateAsync({
         promptMessage: 'Masuk dengan Biometrik',
         fallbackLabel: 'Gunakan Kata Sandi'
       });

       if (!result.success) {
         return { success: false, message: 'Verifikasi biometrik gagal.' };
       }

       // 3. Perform Login with stored credentials
       // We need to import fetchApi, but it's already imported? No, it's imported as `API_URL`.
       // We need to fetch data.
       // NOTE: We cannot use `fetchApi` because it uses the context/token. Use `fetch` directly or imported `API_URL`.
       
       const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: bioId,
          password: bioSec
        })
      });

      const data = await response.json();

      if (!response.ok) {
         // If login fails (e.g. password changed), disable biometrics
         if (response.status === 401) {
            await disableBiometric();
            return { success: false, message: 'Kredenisal tidak valid/berubah. Biometrik dinonaktifkan.' };
         }
         return { success: false, message: data.message || 'Login gagal.' };
      }

      // 4. Sign In
      if (data.accessToken && data.user) {
        await signIn(data.accessToken, data.refreshToken, data.user);
        return { success: true };
      }
      
      return { success: false, message: 'Respon server tidak valid.' };

     } catch (error) {
       console.error("Biometric Login Error", error);
       return { success: false, message: 'Terjadi kesalahan sistem.' };
     }
  };

  // useProtectedRoute is now called in the root layout after the Stack is available or in a separate guard component

  const signIn = async (accessToken: string, refreshToken: string, newUser: User) => {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(newUser));
    setUser(newUser);
    
    // Check if THIS user matches the stored biometric user (if any)
    // If not, we might want to disable biometric context? 
    // Actually, checkBiometricStatus relies on stored keys.
    // If user A logs out, and User B logs in, User B might enable biometrics which overwrites User A.
    // That's acceptable behavior for a single-user-at-a-time app.
    
    // We should re-check biometric status after login to sync state
    checkBiometricStatus();
  };

  const signOut = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        // Optional: call logout API to revoke token on server
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        }).catch(err => console.log('Logout API error (ignoring):', err));
      }
    } catch (e) {}

    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
    
    // Note: We DO NOT delete biometric credentials here. 
    // This allows "Masuk dengan Biometrik" to work after logout.
  };

  const refreshUser = async () => {
    try {
      // We need to fetch the latest user data from the API
      // Since fetchApi automatically adds the token, we can just call the endpoint
      // However, fetchApi is in a separate file and might cause circular dependency if we import it here?
      // Actually, fetchApi imports from this file (for logout callback), so we might have a cycle.
      // But let's check imports. api.ts imports nothing from AuthContext. Wait, api.ts imports `registerLogoutCallback`.
      // AuthContext imports `API_URL, registerLogoutCallback` from api.ts.
      // So importing fetchApi here IS safe.
      
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) return;

      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // The API returns the user object directly based on previous files
        await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
       console.error('Failed to refresh user data', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        refreshUser,
        isBiometricSupported,
        isBiometricEnabled,
        enableBiometric,
        disableBiometric,
        updateBiometricSecret,
        loginWithBiometric
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
