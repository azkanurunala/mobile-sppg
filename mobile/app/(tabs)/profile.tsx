import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { 
  LogOut, 
  ChevronRight, 
  User, 
  Phone, 
  MapPin, 
  Edit2, 
  ShieldCheck,
  Lock,
  Fingerprint
} from 'lucide-react-native';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3); // Max 3 chars
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      {/* Blue Header Background */}
      <View className="bg-blue-600 pb-8 pt-12 px-6 items-center shadow-lg shadow-blue-900/20">
          <Text className="text-white font-bold text-2xl font-plus-jakarta-extrabold self-start mb-6">Profil Saya</Text>
          
          {/* Profile Card */}
          <View className="items-center relative mb-4">
              <View className="w-28 h-28 bg-white rounded-3xl items-center justify-center shadow-lg shadow-blue-800/30">
                  <Text className="text-blue-600 text-5xl font-bold font-plus-jakarta-extrabold">
                    {getInitials(user?.name || 'User')}
                  </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/profile/edit')} className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-100">
                  <Edit2 size={16} color="#2563EB" />
              </TouchableOpacity>
          </View>
          
          <Text className="text-white text-2xl font-bold font-plus-jakarta-extrabold mt-2 text-center">
            {user?.name || 'Pengguna belum login'}
          </Text>
          
          <View className="flex-row items-center mt-2 opacity-90">
             <Phone size={16} color="white" className="mr-3" />
             <Text className="text-white font-medium font-plus-jakarta-semibold text-base ml-2">
                {user?.phoneNumber || 'Tidak ada nomor telepon'}
             </Text>
          </View>

          <View className="flex-row items-start mt-1 opacity-90">
             <MapPin size={16} color="white" className="" />
             <Text className="text-white font-medium font-plus-jakarta-semibold text-base text-center max-w-[250px] ml-2">
                {user?.location || 'Tidak ada lokasi'}
             </Text>
          </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
          <Text className="text-gray-500 font-bold font-plus-jakarta-extrabold mb-4 text-sm uppercase tracking-wider">Akun</Text>
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                onPress={() => router.push('/profile/edit')}
              >
                  <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                          <User size={20} color="#2563EB" />
                      </View>
                      <View>
                          <Text className="text-gray-900 font-bold text-base font-plus-jakarta-extrabold">Update Data Diri</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">Perbarui nama dan telepon</Text>
                      </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
          </View>

          <Text className="text-gray-500 font-bold font-plus-jakarta-extrabold mb-4 text-sm uppercase tracking-wider">Keamanan</Text>
          
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Biometric Toggle */}
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-50">
                  <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                          <ShieldCheck size={20} color="#9333EA" />
                      </View>
                      <View>
                          <Text className="text-gray-900 font-bold text-base font-plus-jakarta-extrabold">Login dengan Biometrik</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">Aktifkan keamanan biometrik</Text>
                      </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Change Password */}
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                onPress={() => router.push('/profile/change-password')}
              >
                  <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center mr-3">
                          <Lock size={20} color="#0D9488" />
                      </View>
                      <View>
                          <Text className="text-gray-900 font-bold text-base font-plus-jakarta-extrabold">Ubah Kata Sandi</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">Perbarui kata sandi Anda</Text>
                      </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-400 text-sm font-plus-jakarta-semibold mb-6">SPPG Mobile Versi 1.0.0</Text>

          {/* Logout Button */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
            <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                onPress={() => setShowLogoutModal(true)}
            >
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                        <LogOut size={20} color="#DC2626" />
                    </View>
                     <View>
                          <Text className="text-red-600 font-bold text-base font-plus-jakarta-extrabold">Keluar</Text>
                          <Text className="text-red-400 text-sm mt-0.5">Keluar dari akun Anda</Text>
                      </View>
                </View>
                <ChevronRight size={20} color="#F87171" />
            </TouchableOpacity>
          </View>
      </ScrollView>

      <ConfirmationModal 
        visible={showLogoutModal}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        type="danger"
        loading={loggingOut}
      />
    </View>
  );
}
