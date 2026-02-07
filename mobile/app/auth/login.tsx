
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Mohon isi No. Handphone/Email dan kata sandi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier,
          password
        })
      });

      if (response.accessToken && response.user) {
        await signIn(response.accessToken, response.refreshToken, response.user);
      }
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
            <View className="w-20 h-20 bg-blue-500 rounded-full mb-4 items-center justify-center">
                <Text className="text-white font-bold text-2xl">SPPG</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 font-plus-jakarta-bold">
                Selamat Datang
            </Text>
            <Text className="text-gray-500 mt-2 font-plus-jakarta-medium">
                Masuk untuk melanjutkan
            </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">No. Handphone / Email</Text>
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-medium"
              placeholder="Masukkan Nomor Handphone atau Email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={identifier}
              onChangeText={setIdentifier}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Kata Sandi</Text>
            <View className="relative">
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-medium"
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                ) : (
                    <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
            
          <TouchableOpacity 
            className="w-full bg-blue-600 rounded-xl py-4 mt-6 shadow-sm shadow-blue-200"
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white text-center font-bold font-plus-jakarta-bold text-base">
                Masuk
                </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500 font-plus-jakarta-medium">Belum punya akun? </Text>
            <Link href="/auth/register" asChild>
                <TouchableOpacity>
                    <Text className="text-blue-600 font-bold font-plus-jakarta-bold">Daftar Sekarang</Text>
                </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
