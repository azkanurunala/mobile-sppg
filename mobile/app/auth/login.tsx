
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Phone, Lock, Fingerprint, Store, Loader2, ScanFace, ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Mohon isi No. Handphone dan kata sandi.');
      return;
    }
    
    setError(null); // Clear previous errors
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
      setError(error.message || 'Kombinasi nomor handphone atau kata sandi tidak sesuai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Section */}
        <View className="items-center justify-center pt-8 pb-10 px-6">
            <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg shadow-black/10">
                 <Store size={48} color="#2563EB" strokeWidth={1.5} />
            </View>
            <Text className="text-3xl font-bold text-white font-plus-jakarta-extrabold text-center mb-2">
                Selamat Datang
            </Text>
            <Text className="text-white/80 font-plus-jakarta-semibold text-center text-sm px-4 leading-5">
                Silakan masuk ke akun SPPG BGN Anda sebagai Korwil
            </Text>
        </View>

        {/* Bottom Sheet Form */}
        <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 shadow-2xl overflow-hidden">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                
                <View className="space-y-6">
                    {/* Phone Input */}
                    <View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-sm mb-2.5">No Handphone Anda</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-[58px]">
                             <Phone size={20} color="#9CA3AF" className="mr-3" />
                             <TextInput
                                className="flex-1 text-gray-900 font-plus-jakarta-semibold text-base h-full"
                                placeholder="Masukkan Nomor Handphone Anda"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                                keyboardType="phone-pad"
                                value={identifier}
                                onChangeText={(text) => {
                                    setIdentifier(text);
                                    if(error) setError(null);
                                }}
                             />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View>
                        <View className="flex-row justify-between items-center mb-2.5">
                            <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-sm">Kata Sandi</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-600 font-bold font-plus-jakarta-extrabold text-xs">Lupa Sandi?</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-[58px]">
                             <Lock size={20} color="#9CA3AF" className="mr-3" />
                             <TextInput
                                className="flex-1 text-gray-900 font-plus-jakarta-semibold text-base h-full bg-transparent"
                                placeholder="Masukkan kata sandi"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if(error) setError(null);
                                }}
                             />
                             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff size={20} color="#9CA3AF" />
                                ) : (
                                    <Eye size={20} color="#9CA3AF" />
                                )}
                             </TouchableOpacity>
                        </View>
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="flex-row items-start bg-red-50 p-3 rounded-xl">
                            <View className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2" />
                            <Text className="text-red-500 text-xs font-plus-jakarta-semibold flex-1 leading-4">
                                {error}
                            </Text>
                        </View>
                    )}
                    
                    {/* Login Button */}
                    <TouchableOpacity 
                        className="w-full bg-primary rounded-2xl h-[58px] items-center justify-center mt-2 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
                        onPress={handleLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className="flex-row items-center">
                                <ScanFace color="white" size={20} className="mr-2 opacity-0 w-0" /> 
                                <Text className="text-white text-base font-bold font-plus-jakarta-extrabold">
                                    Masuk
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-2">
                        <View className="flex-1 h-[1px] bg-gray-100" />
                        <Text className="text-gray-400 text-xs font-plus-jakarta-semibold mx-4">Atau</Text>
                        <View className="flex-1 h-[1px] bg-gray-100" />
                    </View>

                    {/* Biometric Button */}
                    <TouchableOpacity className="w-full bg-orange-50 border border-orange-100 rounded-2xl h-[58px] flex-row items-center justify-center active:bg-orange-100 transition-all">
                        <Fingerprint size={20} className="text-orange-500 mr-2" color="#F97316" />
                        <Text className="text-orange-600 font-bold font-plus-jakarta-extrabold text-sm">
                            Masuk dengan Biometrik
                        </Text>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View className="flex-row justify-center mt-6 mb-8">
                        <Text className="text-gray-500 font-plus-jakarta-semibold">Belum memiliki akun? </Text>
                        <Link href="/auth/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-primary font-bold font-plus-jakarta-extrabold">Daftar Sekarang</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
      
      {/* Bottom SafeArea for white sheet */}
      <View className="bg-white h-10 w-full absolute bottom-0 -z-10" /> 
    </View>
  );
}
