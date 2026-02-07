
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, Phone, MapPin, Edit3, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
        const data = await fetchApi('/user/me');
        setProfile(data);
    } catch (error) {
        console.error('Failed to fetch profile', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
        'Konfirmasi',
        'Apakah Anda yakin ingin keluar?',
        [
            { text: 'Batal', style: 'cancel' },
            { 
                text: 'Ya, Keluar', 
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/auth/login');
                }
            }
        ]
    );
  };

  const displayUser = profile || authUser;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View className="p-6 bg-white mb-4">
        <View className="flex-row items-center">
             <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mx-auto mb-4">
                <Text className="text-blue-600 text-2xl font-bold">{displayUser?.name?.charAt(0)}</Text>
             </View>
        </View>
        <Text className="text-xl font-bold text-gray-900 text-center font-plus-jakarta-bold">{displayUser?.name}</Text>
        <Text className="text-gray-500 text-center mt-1 text-sm font-plus-jakarta-medium">{displayUser?.role}</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Info Card */}
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 space-y-4">
             <View className="flex-row items-center">
                <Phone size={20} color="#4B5563" />
                <View className="ml-3">
                    <Text className="text-gray-500 text-xs">No. Handphone</Text>
                    <Text className="text-gray-900 font-medium">{displayUser?.phoneNumber}</Text>
                </View>
             </View>
            
             <View className="h-[1px] bg-gray-100" />

             <View className="flex-row items-center">
                <MapPin size={20} color="#4B5563" />
                <View className="ml-3">
                    <Text className="text-gray-500 text-xs">Lokasi Tugas</Text>
                    <Text className="text-gray-900 font-medium">{displayUser?.location || 'Belum diatur'}</Text>
                </View>
             </View>
        </View>

        {/* Menu Actions */}
        <View className="space-y-3">
            <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-gray-100"
                onPress={() => router.push('/profile/edit')}
            >
                <View className="flex-row items-center">
                    <Edit3 size={20} color="#2563EB" />
                    <Text className="ml-3 text-gray-900 font-bold">Update Data</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-gray-100"
                onPress={() => router.push('/profile/change-password')}
            >
                <View className="flex-row items-center">
                    <Lock size={20} color="#2563EB" />
                    <Text className="ml-3 text-gray-900 font-bold">Ubah Kata Sandi</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

             <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-gray-100 mt-4"
                onPress={handleLogout}
            >
                <View className="flex-row items-center">
                    <LogOut size={20} color="#EF4444" />
                    <Text className="ml-3 text-red-600 font-bold">Keluar</Text>
                </View>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
