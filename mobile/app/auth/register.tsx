
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    provinceId: '',
    regencyId: '',
    nik: '', // New field
    role: 'KORWIL' // Defaulting to KORWIL for this app context
  });

  const [provinces, setProvinces] = useState<{id: string, name: string}[]>([]);
  const [regencies, setRegencies] = useState<{id: string, name: string}[]>([]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showProvinceSelect, setShowProvinceSelect] = useState(false);
  const [showRegencySelect, setShowRegencySelect] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
        fetchRegencies(formData.provinceId);
    } else {
        setRegencies([]);
    }
  }, [formData.provinceId]);

  const fetchProvinces = async () => {
    try {
        const data = await fetchApi('/wilayah/provinces');
        setProvinces(data);
    } catch (error) {
        console.error('Failed to fetch provinces', error);
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

  const handleRegister = async () => {
    if (!formData.name || !formData.phoneNumber || !formData.password || !formData.provinceId || !formData.regencyId || !formData.nik) {
        Alert.alert('Error', 'Mohon lengkapi semua data including NIK');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok');
        return;
    }

    setIsLoading(true);
    try {
        await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        Alert.alert('Sukses', 'Registrasi berhasil. Silakan login.', [
            { text: 'OK', onPress: () => router.replace('/auth/login') }
        ]);
    } catch (error: any) {
        Alert.alert('Registrasi Gagal', error.message || 'Terjadi kesalahan. NIK mungkin sudah terdaftar.');
    } finally {
        setIsLoading(false);
    }
  };

  const renderSelectModal = (
      visible: boolean, 
      items: {id: string, name: string}[], 
      onSelect: (id: string) => void,
      onClose: () => void,
      title: string
    ) => {
    if (!visible) return null;
    return (
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-50 justify-center px-6 py-20">
            <View className="bg-white rounded-xl p-4 flex-1">
                <Text className="font-bold text-lg mb-4">{title}</Text>
                <ScrollView>
                    {items.map(item => (
                        <TouchableOpacity 
                            key={item.id} 
                            className="py-3 border-b border-gray-100"
                            onPress={() => {
                                onSelect(item.id);
                                onClose();
                            }}
                        >
                            <Text className="text-gray-800 font-plus-jakarta-medium">{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity className="mt-4 p-3 bg-gray-100 rounded-lg" onPress={onClose}>
                    <Text className="text-center font-bold">Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  };

  const selectedProvinceName = provinces.find(p => p.id === formData.provinceId)?.name || 'Pilih Provinsi';
  const selectedRegencyName = regencies.find(r => r.id === formData.regencyId)?.name || 'Pilih Kota/Kabupaten';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {renderSelectModal(showProvinceSelect, provinces, (id) => setFormData({...formData, provinceId: id, regencyId: ''}), () => setShowProvinceSelect(false), 'Pilih Provinsi')}
      {renderSelectModal(showRegencySelect, regencies, (id) => setFormData({...formData, regencyId: id}), () => setShowRegencySelect(false), 'Pilih Kota/Kabupaten')}

      <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 ml-2 font-plus-jakarta-bold">Daftar Akun Korwil</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4 pb-10">
            
            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Nama Lengkap</Text>
                <TextInput
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-medium"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                />
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">NIK (Wajib)</Text>
                <TextInput
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-medium"
                    placeholder="Masukkan 16 digit NIK"
                    keyboardType="number-pad"
                    maxLength={16}
                    value={formData.nik}
                    onChangeText={(text) => setFormData({...formData, nik: text})}
                />
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">No. Handphone</Text>
                <TextInput
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-medium"
                    placeholder="Contoh: 081234567890"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                />
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Provinsi</Text>
                <TouchableOpacity 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    onPress={() => setShowProvinceSelect(true)}
                >
                    <Text className={`font-plus-jakarta-medium ${formData.provinceId ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedProvinceName}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Kota/Kabupaten</Text>
                <TouchableOpacity 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    onPress={() => {
                        if (!formData.provinceId) {
                            Alert.alert('Info', 'Pilih Provinsi terlebih dahulu');
                            return;
                        }
                        setShowRegencySelect(true);
                    }}
                >
                    <Text className={`font-plus-jakarta-medium ${formData.regencyId ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedRegencyName}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Kata Sandi</Text>
                <View className="relative">
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-medium"
                        placeholder="Buat kata sandi"
                        secureTextEntry={!showPassword}
                        value={formData.password}
                        onChangeText={(text) => setFormData({...formData, password: text})}
                    />
                    <TouchableOpacity 
                        className="absolute right-4 top-3"
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-medium">Konfirmasi Kata Sandi</Text>
                <View className="relative">
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 font-plus-jakarta-medium"
                        placeholder="Ulangi kata sandi"
                        secureTextEntry={!showConfirmPassword}
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                    />
                    <TouchableOpacity 
                        className="absolute right-4 top-3"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity 
                className="w-full bg-blue-600 rounded-xl py-4 mt-4 shadow-sm shadow-blue-200"
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-bold font-plus-jakarta-bold text-base">
                        Daftar Sebagai Korwil
                    </Text>
                )}
            </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
