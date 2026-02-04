import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Search, MapPin, Filter, AlignJustify, Briefcase, FileText, CheckCircle } from 'lucide-react-native';
import clsx from 'clsx';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
interface SPPGItem {
  id: string;
  code: string;
  investor: string;
  location: string;
  status: 'Assign Investor' | 'Dokumen Pendaftaran' | 'Proses Persiapan';
  preparationProgress?: number;
}

// Mock Data
const SPPG_DATA: SPPGItem[] = [
  {
    id: '1',
    code: 'SPPG-2024-0812',
    investor: 'PT. Maju Terus Jaya',
    location: 'Kec. Masohi, Amahai',
    status: 'Assign Investor',
  },
  {
    id: '2',
    code: 'SPPG-2024-0945',
    investor: 'CV. Bahari Makmur',
    location: 'Kec. Tehoru, Tehoru',
    status: 'Dokumen Pendaftaran',
  },
  {
    id: '3',
    code: 'SPPG-2024-0721',
    investor: 'PT. Agro Maluku',
    location: 'Kec. Wahai, Saleman',
    status: 'Proses Persiapan',
    preparationProgress: 72,
  },
];

const FilterTab = ({ label, active }: { label: string; active?: boolean }) => (
  <TouchableOpacity
    className={clsx(
      "px-4 py-2 rounded-full mr-2",
      active ? "bg-white" : "bg-blue-500/30"
    )}
  >
    <Text
      className={clsx(
        "text-sm font-semibold",
        active ? "text-blue-600" : "text-white"
      )}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SPPGCard = ({ item }: { item: SPPGItem }) => {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
      {/* Header Row: Code & Action Button */}
      <View className="flex-row justify-between items-start mb-4">
         <View>
            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">KODE SPPG</Text>
            <Text className="text-lg font-bold text-gray-900">{item.code}</Text>
         </View>

         {/* Action Buttons based on Status */}
         {item.status === 'Assign Investor' && (
             <TouchableOpacity className="bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100">
                 <Text className="text-blue-600 text-[10px] font-bold uppercase">ASSIGN INVESTOR</Text>
             </TouchableOpacity>
         )}
         {item.status === 'Dokumen Pendaftaran' && (
             <TouchableOpacity className="bg-purple-50 px-3 py-1.5 rounded-lg active:bg-purple-100">
                 <Text className="text-purple-600 text-[10px] font-bold uppercase">DOKUMEN PENDAFTARAN</Text>
             </TouchableOpacity>
         )}
         {item.status === 'Proses Persiapan' && (
             <View className="bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                 <Text className="text-yellow-600 text-[10px] font-bold uppercase">PROSES PERSIAPAN</Text>
             </View>
         )}
      </View>

      {/* Info Row: Investor & Location */}
      <View className="flex-row mb-5">
        <View className="flex-1 pr-2">
            <View className="flex-row items-center mb-1">
                <Briefcase size={14} className="text-gray-400 mr-2" color="#9CA3AF" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">INVESTOR</Text>
            </View>
            <Text className="text-gray-900 font-semibold text-sm leading-5">{item.investor}</Text>
        </View>
        <View className="flex-1 pl-2">
            <View className="flex-row items-center mb-1">
                <MapPin size={14} className="text-gray-400 mr-2" color="#9CA3AF" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">LOKASI</Text>
            </View>
            <Text className="text-gray-900 font-semibold text-sm leading-5">{item.location}</Text>
        </View>
      </View>

      {/* Progress Section (Only for Proses Persiapan) */}
      {item.status === 'Proses Persiapan' && (
        <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between mb-2">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PERSENTASE PERSIAPAN</Text>
                <Text className="text-xs font-bold text-green-600">{item.preparationProgress}%</Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <View 
                    style={{ width: `${item.preparationProgress}%` }} 
                    className="h-full bg-green-500 rounded-full" 
                />
            </View>
            
            <TouchableOpacity className="bg-blue-600 w-full py-3.5 rounded-xl items-center active:bg-blue-700 shadow-blue-200 shadow-md">
                <Text className="text-white font-bold text-sm">Validasi Data Persiapan</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function SPPGScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      {/* Header Section */}
      <View className="bg-blue-600 pt-16 pb-6 px-6 rounded-b-[32px] shadow-xl z-10">
        
        {/* Top Bar */}
        <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center flex-1 mr-4">
                <View className="w-11 h-11 bg-white/20 rounded-xl items-center justify-center mr-3 relative backdrop-blur-sm">
                    <FileText color="white" size={22} strokeWidth={2.5} />
                    <View className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-[3px] border-blue-600" />
                </View>
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold mb-0.5">Daftar SPPG</Text>
                    <View className="flex-row items-center">
                        <MapPin size={12} color="rgba(255,255,255,0.8)" className="mr-1" />
                        <Text className="text-white/80 text-xs font-medium" numberOfLines={1}>Kab. Maluku Tengah, Maluku</Text>
                    </View>
                </View>
            </View>
            <View className="flex-row space-x-3">
                 <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10 active:bg-white/30 backdrop-blur-md">
                    <Filter color="white" size={20} strokeWidth={2.5} />
                 </TouchableOpacity>
                 <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10 active:bg-white/30 backdrop-blur-md ml-3">
                    <AlignJustify color="white" size={20} strokeWidth={2.5} />
                 </TouchableOpacity>
            </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-2xl px-4 py-3.5 mb-6 border border-white/10 backdrop-blur-sm">
            <Search color="rgba(255,255,255,0.7)" size={20} className="mr-3" />
            <TextInput 
                placeholder="Cari Kode SPPG..." 
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="flex-1 text-white font-medium text-base leading-none pt-0 pb-0"
                selectionColor="white"
            />
        </View>

        {/* Filter Tabs */}
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1 p-1">
                <FilterTab label="Semua Status" active />
                <FilterTab label="Proses Persiapan" />
                <FilterTab label="Validasi Data Persiapan" />
                <View className="w-4" /> 
            </ScrollView>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5 pt-6">
        <Text className="text-gray-400 text-xs font-medium mb-4 text-center">Menampilkan hasil pencarian berdasarkan data terbaru</Text>
        <FlatList
            data={SPPG_DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SPPGCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </View>
  );
}
