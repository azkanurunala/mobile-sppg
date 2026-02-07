
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MapPin, Briefcase, CheckSquare, ChevronRight } from 'lucide-react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { fetchApi } from '@/lib/api';

export default function SPPGDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [checklistSummary, setChecklistSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
        const [detailRes, checklistRes] = await Promise.all([
            fetchApi(`/sppg/${id}`),
            fetchApi(`/sppg/${id}/checklist`)
        ]);
        setDetail(detailRes);
        setChecklistSummary(checklistRes.summary);
    } catch (error) {
        console.error('Failed to fetch detail', error);
    } finally {
        setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchData();
    }, [id])
  );

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  if (!detail) return <View><Text>Error loading data</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
            <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-bold">Detail SPPG</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Main Card */}
        <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-gray-500 text-xs mb-1">Kode SPPG</Text>
                    <Text className="text-xl font-bold text-gray-900">{detail.code}</Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-xs font-bold">{detail.status}</Text>
                </View>
            </View>

            <View className="h-[1px] bg-gray-100 my-2" />

            <View className="space-y-4">
                <View className="flex-row items-start">
                    <MapPin size={18} color="#4B5563" className="mt-1" />
                    <View className="ml-3 flex-1">
                        <Text className="text-gray-500 text-xs">Lokasi</Text>
                        <Text className="text-gray-900 font-plus-jakarta-medium mt-1">
                            {detail.location 
                                ? `${detail.location.village}, ${detail.location.district}`
                                : detail.snapshot.village
                            }
                        </Text>
                        <Text className="text-gray-600 text-xs mt-0.5">
                            {detail.location 
                                ? `${detail.location.regency}, ${detail.location.province}`
                                : `${detail.snapshot.regency}, ${detail.snapshot.province}`
                            }
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-start">
                    <Briefcase size={18} color="#4B5563" className="mt-1" />
                    <View className="ml-3 flex-1">
                        <Text className="text-gray-500 text-xs">Investor</Text>
                        <Text className="text-gray-900 font-plus-jakarta-medium mt-1">
                            {detail.investor ? detail.investor.name : 'Belum Ada Investor'}
                        </Text>
                        {detail.investor && <Text className="text-gray-600 text-xs">{detail.investor.code}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => router.push(`/sppg/${id}/investor`)}>
                        <Text className="text-blue-600 text-xs font-bold mt-2">Lihat Detail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Checklist Progress Card */}
        <TouchableOpacity 
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-row items-center justify-between"
            onPress={() => router.push(`/sppg/${id}/checklist`)}
        >
            <View className="flex-row items-center flex-1">
                 <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mr-4">
                    <CheckSquare size={24} color="#16A34A" />
                 </View>
                 <View>
                    <Text className="text-gray-900 font-bold text-base">Checklist Validasi</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                        {checklistSummary ? `${checklistSummary.percentage}% Selesai` : 'Loading...'}
                    </Text>
                 </View>
            </View>
            <ChevronRight size={24} color="#9CA3AF" />
        </TouchableOpacity>

      </ScrollView>

      {/* Action Button */}
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity 
            className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg shadow-blue-200"
            onPress={() => router.push(`/sppg/${id}/checklist`)}
        >
            <Text className="text-white font-bold text-base">Mulai Validasi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
