
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

import { API_URL, registerLogoutCallback } from '@/lib/api';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  location?: string;
  nik?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const userData = await SecureStore.getItemAsync('user_data');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
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

  // useProtectedRoute is now called in the root layout after the Stack is available or in a separate guard component

  const signIn = async (accessToken: string, refreshToken: string, newUser: User) => {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(newUser));
    setUser(newUser);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
