
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, User, Phone, Mail, FileText, Briefcase } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';

export default function InvestorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchApi(`/sppg/${id}`);
            setDetail(data);
        } catch (error) {
            console.error('Failed to fetch investor info', error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  const investor = detail?.investor;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-bold">Detail Investor</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {!investor ? (
            <View className="items-center justify-center mt-20">
                <Text className="text-gray-500 font-plus-jakarta-medium">Belum ada data investor</Text>
            </View>
        ) : (
            <>
                <View className="items-center mb-6 mt-4">
                    <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
                        <Briefcase size={32} color="#2563EB" />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 text-center">{investor.name}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{investor.type}</Text>
                    <View className="bg-blue-50 px-3 py-1 rounded-full mt-2">
                        <Text className="text-blue-600 text-xs font-bold">{investor.code}</Text>
                    </View>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                    <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                        <Mail size={20} color="#4B5563" />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-xs">Email</Text>
                            <Text className="text-gray-900 font-medium">{investor.email || '-'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                        <Phone size={20} color="#4B5563" />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-xs">No. Handphone</Text>
                            <Text className="text-gray-900 font-medium">{investor.phone || '-'}</Text>
                        </View>
                    </View>
                    
                    {investor.nik && (
                        <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                            <FileText size={20} color="#4B5563" />
                            <View className="ml-3">
                                <Text className="text-gray-500 text-xs">NIK</Text>
                                <Text className="text-gray-900 font-medium">{investor.nik}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
