
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user: User | null, isNavigationReady: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isNavigationReady]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

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
        setTimeout(() => setIsNavigationReady(true), 100);
      }
    };

    loadUser();
  }, []);

  useProtectedRoute(user, isNavigationReady);

  const signIn = async (accessToken: string, refreshToken: string, newUser: User) => {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
