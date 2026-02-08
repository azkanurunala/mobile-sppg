
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Eye, EyeOff, ShieldCheck, Info, Check } from 'lucide-react-native';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Custom Alert State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'danger',
        onConfirm: () => {},
        confirmText: 'OK'
  });

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'danger' = 'info', onConfirm: () => void = () => setModalVisible(false)) => {
        setModalConfig({
            title,
            message,
            type,
            onConfirm: () => {
                onConfirm();
                setModalVisible(false);
            },
            confirmText: 'OK'
        });
        setModalVisible(true);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('Error', 'Mohon isi semua bidang', 'danger');
        return;
    }

    if (newPassword.length < 8) {
        showAlert('Error', 'Kata sandi baru minimal 8 karakter', 'danger');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('Error', 'Konfirmasi kata sandi baru tidak cocok', 'danger');
        return;
    }

    setLoading(true);
    try {
        await fetchApi('/user/change-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        showAlert('Sukses', 'Kata sandi berhasil diubah', 'success', () => router.back());
    } catch (error: any) {
        showAlert('Gagal', error.message || 'Gagal mengubah kata sandi', 'danger');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
       
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 font-plus-jakarta-extrabold">Ubah Kata Sandi</Text>
      </View>

      <ConfirmationModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />

      <ScrollView className="flex-1 px-6 pt-8">
        <View className="items-start mb-8">
            <View className="w-16 h-16 bg-blue-100 rounded-2xl items-center justify-center mb-4">
                <ShieldCheck size={32} color="#2563EB" fill="#2563EB" />
            </View>
            <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-extrabold mb-2">Amankan Akun Anda</Text>
            <Text className="text-gray-500 font-plus-jakarta-medium leading-5">
                Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
            </Text>
        </View>

        <View className="space-y-6 pb-10">
            
            {/* Current Password */}
            <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Kata Sandi Saat Ini</Text>
                 <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-2xl overflow-hidden focus:border-blue-500">
                    <TextInput
                        className="flex-1 px-4 py-3 font-plus-jakarta-bold text-gray-900 text-base"
                        placeholder="Masukkan kata sandi lama"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showCurrent}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} className="px-4">
                        {showCurrent ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            {/* New Password */}
            <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Kata Sandi Baru</Text>
                 <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-2xl overflow-hidden focus:border-blue-500">
                    <TextInput
                        className="flex-1 px-4 py-3 font-plus-jakarta-bold text-gray-900 text-base"
                        placeholder="Minimal 8 karakter"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showNew}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)} className="px-4">
                        {showNew ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-400 text-xs mt-2 font-plus-jakarta-medium">Kata sandi harus terdiri dari huruf dan angka.</Text>
            </View>

            {/* Confirm Password */}
            <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Konfirmasi Kata Sandi Baru</Text>
                 <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-2xl overflow-hidden focus:border-blue-500">
                    <TextInput
                        className="flex-1 px-4 py-3 font-plus-jakarta-bold text-gray-900 text-base"
                        placeholder="Ulangi kata sandi baru"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showConfirm}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="px-4">
                        {showConfirm ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Info Card */}
            <View className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex-row items-start">
                <Info size={20} color="#F97316" style={{ marginTop: 2, marginRight: 12 }} />
                <Text className="flex-1 text-orange-800 font-plus-jakarta-medium text-sm leading-5">
                    Pastikan kata sandi baru Anda tidak sama dengan kata sandi yang digunakan sebelumnya atau yang mudah ditebak.
                </Text>
            </View>

        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="p-6 border-t border-gray-50 bg-white shadow-lg shadow-gray-100">
        <TouchableOpacity 
            className="w-full bg-blue-600 rounded-full py-4 items-center justify-center shadow-lg shadow-blue-200 active:scale-95"
            onPress={handleSave}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <View className="flex-row items-center">
                    <Text className="text-white text-center font-bold font-plus-jakarta-extrabold text-lg mr-2">
                        Perbarui Kata Sandi
                    </Text>
                    <Check size={20} color="white" />
                </View>
            )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
