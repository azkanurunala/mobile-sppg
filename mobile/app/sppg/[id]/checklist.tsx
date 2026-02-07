
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Info, CheckCircle, XCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';

interface ChecklistItem {
  masterItemId: string;
  key: string;
  name: string;
  description: string;
  weight: number;
  isCompleted: boolean | null;
}

export default function ChecklistScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const fetchChecklist = async () => {
    try {
        const data = await fetchApi(`/sppg/${id}/checklist`);
        setItems(data.checklist);
        setSummary(data.summary);
        setLoading(false);
    } catch (error) {
        console.error('Failed to fetch checklist', error);
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id]);

  const toggleItem = (masterItemId: string, status: boolean) => {
    setItems(prevItems => 
        prevItems.map(item => 
            item.masterItemId === masterItemId 
                ? { ...item, isCompleted: status } 
                : item
        )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        await fetchApi(`/sppg/${id}/checklist`, {
            method: 'POST',
            body: JSON.stringify({
                items: items.map(i => ({
                    masterItemId: i.masterItemId,
                    isCompleted: i.isCompleted
                }))
            })
        });
        
        // Refetch to get updated summary/calculation from server
        await fetchChecklist();
        
        Alert.alert('Sukses', 'Data validasi berhasil disimpan');
    } catch (error: any) {
        Alert.alert('Gagal', error.message || 'Gagal menyimpan data');
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    );
  }

  // Calculate local progress for immediate feedback
  const currentWeight = items.reduce((sum, item) => item.isCompleted ? sum + item.weight : sum, 0);
  const totalWeight = summary?.totalWeight || 100;
  const percentage = Math.round((currentWeight / totalWeight) * 100);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
                <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-bold">Checklist Validasi</Text>
        </View>
        <TouchableOpacity 
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onPress={handleSave}
            disabled={saving}
        >
            {saving ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <Text className="text-white font-bold text-sm">Simpan</Text>
            )}
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View className="bg-blue-600 p-6">
        <View className="flex-row justify-between items-center mb-2">
            <Text className="text-blue-100 font-plus-jakarta-medium">Total Progress</Text>
            <Text className="text-white font-bold text-2xl">{percentage}%</Text>
        </View>
        <View className="h-2 bg-blue-800 rounded-full overflow-hidden">
            <View 
                className="h-full bg-blue-300 rounded-full" 
                style={{ width: `${percentage}%` }} 
            />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
         {items.map((item) => (
             <View key={item.masterItemId} className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-gray-900 font-bold text-base flex-1 mr-2 font-plus-jakarta-bold">
                        {item.name}
                    </Text>
                    <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-gray-600 text-xs font-bold">{item.weight}%</Text>
                    </View>
                </View>
                
                <Text className="text-gray-500 text-sm mb-4 font-plus-jakarta-medium">
                    {item.description}
                </Text>

                <View className="flex-row space-x-3">
                    <TouchableOpacity 
                        className={`flex-1 flex-row items-center justify-center py-3 rounded-lg border ${item.isCompleted === true ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                        onPress={() => toggleItem(item.masterItemId, true)}
                    >
                        <CheckCircle size={18} color={item.isCompleted === true ? '#16A34A' : '#9CA3AF'} />
                        <Text className={`ml-2 font-bold ${item.isCompleted === true ? 'text-green-600' : 'text-gray-500'}`}>
                            YA
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className={`flex-1 flex-row items-center justify-center py-3 rounded-lg border ${item.isCompleted === false ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'}`}
                        onPress={() => toggleItem(item.masterItemId, false)}
                    >
                         <XCircle size={18} color={item.isCompleted === false ? '#EF4444' : '#9CA3AF'} />
                         <Text className={`ml-2 font-bold ${item.isCompleted === false ? 'text-red-600' : 'text-gray-500'}`}>
                            TIDAK
                        </Text>
                    </TouchableOpacity>
                </View>
             </View>
         ))}
         
         <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
