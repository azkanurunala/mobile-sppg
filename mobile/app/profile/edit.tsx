
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    regencyId: '',
    // Province logic could be re-added if user needs to select province first, but for update we often just show current
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Lists for selection
  const [regencies, setRegencies] = useState<{id: string, name: string}[]>([]);
  // Simplified: In a real app we'd fetch provinces first or current province of user.
  // For now, let's just allow editing Name and Phone as primary, location might be complex to change if logic binds to Korwil area.
  // The UI `update-data-form.tsx` has province/city select.

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const data = await fetchApi('/user/me');
        setFormData({
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            regencyId: data.locationDetail?.regencyId || ''
        });
        
        // If we want to allow changing location, we need to fetch master data. 
        // For simplicity in this iteration, we focus on Name/Phone unless user has strict requirement to move regions.
        // But `update-data-form.tsx` has selectors. Let's assume we can fetch regencies for current province or all.
    } catch (error) {
        console.error('Failed to fetch profile', error);
    } finally {
        setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        await fetchApi('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        // Update local context if needed, or just re-fetch on profile page
        // We should construct a new user object to update context immediately if we want
        if (user) {
             const updatedUser = { ...user, name: formData.name, phoneNumber: formData.phoneNumber };
             // Note: Token doesn't change, but user data in storage does. 
             // Ideally `signIn` updates user state too.
             // We can just rely on Profile screen re-fetching.
        }

        Alert.alert('Sukses', 'Data berhasil diperbarui', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    } catch (error: any) {
        Alert.alert('Gagal', error.message || 'Gagal memperbarui data');
    } finally {
        setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-extrabold">Update Data</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4">
             <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-semibold">Nama Lengkap</Text>
                <TextInput
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-semibold"
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                />
            </View>

             <View>
                <Text className="text-gray-700 mb-2 font-plus-jakarta-semibold">No. Handphone</Text>
                <TextInput
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-plus-jakarta-semibold"
                    value={formData.phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                />
            </View>

            {/* Location fields could be added here similar to Register if needed */}
            
            <TouchableOpacity 
                className="w-full bg-blue-600 rounded-2xl py-4 mt-6 shadow-sm shadow-blue-200"
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-bold font-plus-jakarta-extrabold text-base">
                        Simpan Data
                    </Text>
                )}
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
