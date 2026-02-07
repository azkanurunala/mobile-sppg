
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
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

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Mohon isi semua bidang');
        return;
    }

    if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Konfirmasi kata sandi baru tidak cocok');
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

        Alert.alert('Sukses', 'Kata sandi berhasil diubah', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    } catch (error: any) {
        Alert.alert('Gagal', error.message || 'Gagal mengubah kata sandi');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
       
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-extrabold">Ubah Kata Sandi</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4">
            
            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-semibold">Kata Sandi Saat Ini</Text>
                 <View className="relative">
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-semibold"
                        placeholder="Masukkan kata sandi lama"
                        secureTextEntry={!showCurrent}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TouchableOpacity className="absolute right-4 top-3" onPress={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-semibold">Kata Sandi Baru</Text>
                 <View className="relative">
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-semibold"
                        placeholder="Masukkan kata sandi baru"
                        secureTextEntry={!showNew}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity className="absolute right-4 top-3" onPress={() => setShowNew(!showNew)}>
                        {showNew ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-semibold">Konfirmasi Kata Sandi Baru</Text>
                 <View className="relative">
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-semibold"
                        placeholder="Ulangi kata sandi baru"
                        secureTextEntry={!showConfirm}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity className="absolute right-4 top-3" onPress={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity 
                className="w-full bg-blue-600 rounded-2xl py-4 mt-6 shadow-sm shadow-blue-200"
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-bold font-plus-jakarta-extrabold text-base">
                        Simpan Perubahan
                    </Text>
                )}
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
