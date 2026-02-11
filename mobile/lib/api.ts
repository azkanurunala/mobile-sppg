
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Production URL

const PROD_API_URL = 'https://sppg-opal.vercel.app/api/mobile';

/*
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api/mobile',
  ios: 'http://localhost:3000/api/mobile',
  default: 'http://localhost:3000/api/mobile',
});
*/

export const API_URL = PROD_API_URL;
// export const API_URL = DEV_API_URL;

export async function getAccessToken() {
  return await SecureStore.getItemAsync('access_token');
}

export async function getRefreshToken() {
  return await SecureStore.getItemAsync('refresh_token');
}

let onLogout: (() => void) | null = null;

export const registerLogoutCallback = (callback: () => void) => {
  onLogout = callback;
};

export async function fetchApi(endpoint: string, options: any = {}) {
  const token = await getAccessToken();
  
  let url = `${API_URL}${endpoint}`;
  if (options.params) {
    const params = new URLSearchParams(options.params);
    url += `?${params.toString()}`;
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    let response = await fetch(url, config);
    
    // Handle Token Expiry
    if (response.status === 401 && !options._retry) {
       const refreshToken = await getRefreshToken();
       if (refreshToken) {
          // Attempt to refresh
          try {
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
               const data = await refreshRes.json();
               const newAccess = data.accessToken;
               const newRefresh = data.refreshToken;

               await SecureStore.setItemAsync('access_token', newAccess);
               if (newRefresh) await SecureStore.setItemAsync('refresh_token', newRefresh);
               
               // Retry original request (re-fetch with updated token)
               return fetchApi(endpoint, { ...options, _retry: true });
            } else {
               // Refresh failed (invalid/expired refreshToken) -> clear everything
               await SecureStore.deleteItemAsync('access_token');
               await SecureStore.deleteItemAsync('refresh_token');
               await SecureStore.deleteItemAsync('user_data');
               
               // Trigger Global Logout
               if (onLogout) onLogout();
               throw { status: 401, message: 'Session Expired' };
            }
          } catch (e) {
            console.error('API Refresh Error:', e);
            // If network error during refresh, maybe don't logout immediately?
            // But if it's a persistent error, user is stuck. 
            // Better to let them re-login.
             if (onLogout) onLogout();
          }
       } else {
           // No refresh token available, but got 401 -> Logout
           if (onLogout) onLogout();
       }
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw { status: response.status, message: data.error || 'API Error', data };
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}
