
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Android Emulator localhost is 10.0.2.2
// iOS Simulator localhost is 127.0.0.1
// Physical device needs your machine's LAN IP
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api/mobile',
  ios: 'http://localhost:3000/api/mobile',
  default: 'http://localhost:3000/api/mobile',
});

export const API_URL = DEV_API_URL;

export async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const headers = await getAuthHeaders();
  
  let url = `${API_URL}${endpoint}`;
  if (options.params) {
    const params = new URLSearchParams(options.params);
    url += `?${params.toString()}`;
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized (Token expired/invalid) specifically if needed
    if (response.status === 401) {
       // Could trigger a global logout event here
       await SecureStore.deleteItemAsync('auth_token');
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
