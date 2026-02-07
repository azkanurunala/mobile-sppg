import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, User, Phone, MapPin, Building, Lock, ArrowRight, UserPlus, ChevronDown, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';

// Reusable Selection Modal Component
const SelectionModal = ({ 
  visible, 
  items, 
  onSelect, 
  onClose, 
  title 
}: {
  visible: boolean;
  items: {id: string; name: string}[];
  onSelect: (id: string) => void;
  onClose: () => void;
  title: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset search query when modal opens
  useEffect(() => {
    if (visible) setSearchQuery('');
  }, [visible]);

  if (!visible) return null;

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 bg-black/50 justify-center px-6 py-20">
            <View className="bg-white rounded-xl flex-1 overflow-hidden">
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-lg font-plus-jakarta-extrabold">{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                    {/* Search Input */}
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <Search size={20} color="#9CA3AF" className="mr-2" />
                        <TextInput 
                            className="flex-1 font-plus-jakarta-medium text-gray-900 py-2 pl-4"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                
                <ScrollView className="flex-1 px-4">
                    {filteredItems.length === 0 ? (
                        <View className="py-8 items-center">
                            <Text className="text-gray-500 text-center font-plus-jakarta-medium">Tidak ditemukan</Text>
                        </View>
                    ) : (
                        filteredItems.map(item => (
                            <TouchableOpacity 
                                key={item.id} 
                                className="py-3 border-b border-gray-100"
                                onPress={() => {
                                    onSelect(item.id);
                                    onClose();
                                }}
                            >
                                <Text className="text-gray-800 font-plus-jakarta-semibold">{item.name}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    </Modal>
  );
};

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
        Alert.alert('Error', 'Mohon lengkapi semua data termasuk NIK');
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

  const selectedProvinceName = provinces.find(p => p.id === formData.provinceId)?.name || 'Pilih Provinsi';
  const selectedRegencyName = regencies.find(r => r.id === formData.regencyId)?.name || 'Pilih Kota/Kabupaten';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <SelectionModal 
        visible={showProvinceSelect}
        items={provinces}
        onSelect={(id) => setFormData({...formData, provinceId: id, regencyId: ''})}
        onClose={() => setShowProvinceSelect(false)}
        title="Pilih Provinsi"
      />

      <SelectionModal 
        visible={showRegencySelect}
        items={regencies}
        onSelect={(id) => setFormData({...formData, regencyId: id})}
        onClose={() => setShowRegencySelect(false)}
        title="Pilih Kota/Kabupaten"
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}>
            {/* Header Section */}
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-200">
                    <UserPlus size={40} color="white" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 font-plus-jakarta-extrabold mb-2">Daftar Akun</Text>
                <Text className="text-gray-500 text-center font-plus-jakarta-semibold px-4">
                    Lengkapi data diri Anda untuk mendaftar layanan SPPG Mobile
                </Text>
            </View>

            <View>
                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-extrabold text-sm">Nama Lengkap</Text>
                    <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500">
                        <User size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            className="flex-1 font-plus-jakarta-semibold text-gray-900 py-2 pl-4"
                            placeholder="Masukkan nama lengkap Anda"
                            placeholderTextColor="#9CA3AF"
                            value={formData.name}
                            onChangeText={(text) => setFormData({...formData, name: text})}
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-extrabold text-sm">NIK (Wajib)</Text>
                    <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500">
                        <User size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            className="flex-1 font-plus-jakarta-semibold text-gray-900 py-2 pl-4"
                            placeholder="Masukkan 16 digit NIK"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            maxLength={16}
                            value={formData.nik}
                            onChangeText={(text) => setFormData({...formData, nik: text})}
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-extrabold text-sm">No Telepon</Text>
                    <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500">
                        <Phone size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            className="flex-1 font-plus-jakarta-semibold text-gray-900 py-2 pl-4"
                            placeholder="Contoh: 081234567890"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            value={formData.phoneNumber}
                            onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-bold text-sm">Provinsi</Text>
                    <TouchableOpacity 
                        className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2"
                        onPress={() => setShowProvinceSelect(true)}
                    >
                        <MapPin size={20} color="#9CA3AF" className="mr-3" />
                        <Text className={`flex-1 font-plus-jakarta-medium py-2 pl-4 ${formData.provinceId ? 'text-gray-900' : 'text-gray-400'}`}>
                            {selectedProvinceName}
                        </Text>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-bold text-sm">Kota/Kabupaten</Text>
                    <TouchableOpacity 
                        className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2"
                        onPress={() => {
                            if (!formData.provinceId) {
                                Alert.alert('Info', 'Pilih Provinsi terlebih dahulu');
                                return;
                            }
                            setShowRegencySelect(true);
                        }}
                    >
                        <Building size={20} color="#9CA3AF" className="mr-3" />
                        <Text className={`flex-1 font-plus-jakarta-medium py-2 pl-4 ${formData.regencyId ? 'text-gray-900' : 'text-gray-400'}`}>
                            {selectedRegencyName}
                        </Text>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-bold text-sm">Kata Sandi</Text>
                    <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500">
                        <Lock size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            className="flex-1 font-plus-jakarta-medium text-gray-900 py-2 pl-4"
                            placeholder="Buat kata sandi"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={formData.password}
                            onChangeText={(text) => setFormData({...formData, password: text})}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-2 font-plus-jakarta-bold text-sm">Ulangi Kata Sandi</Text>
                    <View className="flex-row items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500">
                        <Lock size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            className="flex-1 font-plus-jakarta-medium text-gray-900 py-2 pl-4"
                            placeholder="Ulangi kata sandi"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    className="flex-row w-full bg-blue-600 rounded-2xl py-4 mt-4 shadow-lg shadow-blue-200 justify-center items-center"
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white text-center font-bold font-plus-jakarta-bold text-base mr-2">
                                Daftar Sekarang
                            </Text>
                            <ArrowRight size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500 font-plus-jakarta-medium">Sudah memiliki akun? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text className="text-blue-600 font-bold font-plus-jakarta-bold">Masuk di sini</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
