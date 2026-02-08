
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronDown, Save as SaveIcon } from 'lucide-react-native';
import SelectionModal from '@/components/ui/SelectionModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, signIn, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    provinceId: '',
    regencyId: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [provinces, setProvinces] = useState<{id: string, name: string}[]>([]);
  const [regencies, setRegencies] = useState<{id: string, name: string}[]>([]);
  const [showProvinceSelect, setShowProvinceSelect] = useState(false);
  const [showRegencySelect, setShowRegencySelect] = useState(false);
  
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

  useEffect(() => {
    fetchProfileAndMasterData();
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
        fetchRegencies(formData.provinceId);
    } else {
        setRegencies([]);
    }
  }, [formData.provinceId]);

  const fetchProfileAndMasterData = async () => {
    try {
        const [profile, provincesData] = await Promise.all([
            fetchApi('/user/me'),
            fetchApi('/wilayah/provinces')
        ]);

        setFormData({
            name: profile.name,
            phoneNumber: profile.phoneNumber.replace('+62', '') || '', // Strip prefix for display
            email: profile.email,
            provinceId: profile.locationDetail?.provinceId || '',
            regencyId: profile.locationDetail?.regencyId || ''
        });
        setProvinces(provincesData);

        // If user has province, fetch regencies for it
        if (profile.locationDetail?.provinceId) {
             const regenciesData = await fetchApi(`/wilayah/regencies?provinceId=${profile.locationDetail?.provinceId}`);
             setRegencies(regenciesData);
        }

    } catch (error) {
        console.error('Failed to fetch data', error);
        showAlert('Error', 'Gagal memuat data profil', 'danger');
    } finally {
        setInitialLoading(false);
    }
  };

  const fetchRegencies = async (provinceId: string) => {
    try {
        const data = await fetchApi(`/wilayah/regencies?provinceId=${provinceId}`);
        setRegencies(data);
    } catch (error) {
        console.error('Failed to fetch regencies', error);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phoneNumber) {
        showAlert('Error', 'Nama dan No. Telepon wajib diisi', 'danger');
        return;
    }

    setLoading(true);
    try {
        await fetchApi('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({
                ...formData,
                phoneNumber: formData.phoneNumber.startsWith('+62') ? formData.phoneNumber : `+62${formData.phoneNumber}`
            })
        });
        
        // Refresh local user context
        await refreshUser();
        
        showAlert('Sukses', 'Data berhasil diperbarui', 'success', () => router.back());
    } catch (error: any) {
        showAlert('Gagal', error.message || 'Gagal memperbarui data', 'danger');
    } finally {
        setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  const selectedProvinceName = provinces.find(p => p.id === formData.provinceId)?.name || 'Pilih Provinsi';
  const selectedRegencyName = regencies.find(r => r.id === formData.regencyId)?.name || 'Pilih Kota/Kabupaten';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      


      <View className="flex-row items-center px-6 py-4 border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 font-plus-jakarta-extrabold">Update Data</Text>
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
        <View className="space-y-6 pb-10">
             {/* Nama */}
             <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Nama</Text>
                <View className="w-full bg-white border border-gray-200 rounded-2xl  font-plus-jakarta-bold text-gray-900 focus:border-blue-500">
                    <TextInput
                        className="flex-1 font-plus-jakarta-bold text-gray-900 text-base px-4 py-3"
                        value={formData.name}
                        placeholder="Masukkan nama lengkap"
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(text) => setFormData({...formData, name: text})}
                    />
                </View>
            </View>

             {/* No Telp with Prefix */}
             <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">No Telp</Text>
                <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-2xl overflow-hidden focus:border-blue-500">
                    <TextInput
                        className="flex-1 px-4 py-3 font-plus-jakarta-bold text-gray-900 text-base"
                        value={formData.phoneNumber}
                        keyboardType="phone-pad"
                        placeholder="812xxxxxxx"
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                    />
                </View>
            </View>

            {/* Provinsi */}
            <View className='mb-4'>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Provinsi</Text>
                <View 
                    className="flex-row items-center justify-between w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4"
                >
                    <Text className="flex-1 font-plus-jakarta-bold text-base text-gray-500">
                        {selectedProvinceName}
                    </Text>
                </View>
            </View>

            {/* Kota/Kabupaten */}
            <View>
                <Text className="text-gray-500 mb-2 font-plus-jakarta-semibold text-xs uppercase tracking-wide">Kota/Kabupaten</Text>
                <View 
                    className="flex-row items-center justify-between w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4"
                >
                    <Text className="flex-1 font-plus-jakarta-bold text-base text-gray-500">
                        {selectedRegencyName}
                    </Text>
                </View>
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
                    <SaveIcon size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white text-center font-bold font-plus-jakarta-extrabold text-lg">
                        Simpan Data
                    </Text>
                </View>
            )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

