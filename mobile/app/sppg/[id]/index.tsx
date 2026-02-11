
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Dimensions, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  ChevronLeft, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  ChevronRight, 
  Map as MapIcon, 
  ListChecks, 
  Building2, 
  Mail, 
  Copy, 
  CheckCircle, 
  XCircle,
  FileText,
  User
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { fetchApi } from '@/lib/api';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

interface ChecklistItem {
  masterItemId: string;
  key: string;
  name: string;
  description: string;
  weight: number;
  isCompleted: boolean | null;
}

export default function SPPGDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [checklistSummary, setChecklistSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'investor'>('checklist');

  const fetchData = async () => {
    try {
        // Keep loading true only on first load if we want silent updates, 
        // but for now let's keep it simple or maybe just show a spinner if detail is null
        const [detailRes, checklistRes] = await Promise.all([
            fetchApi(`/sppg/${id}`),
            fetchApi(`/sppg/${id}/checklist`)
        ]);
        setDetail(detailRes);
        setChecklistItems(checklistRes.checklist);
        setChecklistSummary(checklistRes.summary);
        setLoading(false);
    } catch (error) {
        console.error('Failed to fetch detail', error);
        setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [id])
  );





  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Disalin', 'Teks berhasil disalin ke clipboard');
  };

  const openGoogleMaps = () => {
    const lat = detail.lat;
    const lng = detail.long;
    
    if (!lat || !lng) {
        Alert.alert("Lokasi Tidak Tersedia", "Koordinat lokasi belum diatur.");
        return;
    }

    const label = encodeURIComponent(`SPPG ${detail.code}`);
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
        Linking.openURL(url).catch(err => {
            // Fallback to browser
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
        });
    }
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-blue-600">
            <ActivityIndicator size="large" color="white" />
        </View>
    );
  }

  if (!detail) return <View><Text>Error loading data</Text></View>;

  // Calculate local progress for immediate feedback
  const currentWeight = checklistItems.reduce((sum, item) => item.isCompleted ? sum + item.weight : sum, 0);
  const totalWeight = checklistSummary?.totalWeight || 100;
  const percentage = Math.round((currentWeight / totalWeight) * 100);

  const StatusIcon = ({ isCompleted }: { isCompleted: boolean | null }) => {
      if (isCompleted === true) return <View className="bg-lime-500 rounded-full p-1"><CheckCircle size={16} color="white" /></View>;
      if (isCompleted === false) return <View className="bg-red-500 rounded-full p-1"><XCircle size={16} color="white" /></View>;
      return <View className="bg-gray-200 rounded-full p-1"><View className="w-4 h-4" /></View>; // Empty placeholder
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      {/* Scrollable Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 180 }}>
        
        {/* Blue Header Background */}
        <View className="bg-blue-600 pb-24 pt-12 px-5 relative">
            {/* Nav Bar */}
            <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10">
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <View className="bg-white/20 px-4 py-1.5 rounded-full border border-white/10">
                    <Text className="text-white text-xs font-bold font-plus-jakarta-extrabold">{detail.status}</Text>
                </View>
            </View>
            
            <Text className="text-white text-2xl font-bold font-plus-jakarta-extrabold mb-4">SPPG {detail.code}</Text>
            <View className="flex-row items-center mb-4">
                <MapPin size={16} color="white" />
                <Text className="text-white text-sm font-plus-jakarta-semibold ml-1">
                    {(detail.location?.village || detail.snapshot?.village || '-')}, Kec. {(detail.location?.district || detail.snapshot?.district || '-')}
                </Text>
            </View>
        </View>

        {/* Floating Info Card */}
        <View className="mx-5 -mt-20 bg-white rounded-3xl p-5 shadow-lg shadow-blue-900/10 mb-6">
            <View className="flex-row mb-6">
                <View className="flex-1 space-y-4">
                    <View className='mb-4'>
                        <View className="flex-row items-center mb-1">
                            <MapPin size={12} color="#9CA3AF" className="mr-1" />
                            <Text className="ml-1 text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase">Provinsi</Text>
                        </View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-base">
                            {detail.location?.province || detail.snapshot?.province || '-'}
                        </Text>
                    </View>
                    <View className='mb-4'>
                         <View className="flex-row items-center mb-1">
                            <MapPin size={12} color="#9CA3AF" className="mr-1" />
                            <Text className="ml-1 text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase">Kecamatan</Text>
                        </View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-base">
                             {detail.location?.district || detail.snapshot?.district || '-'}
                        </Text>
                    </View>
                     <View>
                        <View className="flex-row items-center mb-1">
                            <FileText size={12} color="#9CA3AF" className="mr-1" />
                            <Text className="ml-1 text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase">Kode Pos</Text>
                        </View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-base">
                             {detail.postalCode || '97511'}
                        </Text>
                    </View>
                </View>

                <View className="flex-1 space-y-4 pl-4 border-l border-gray-100">
                     <View className='mb-4'>
                        <View className="flex-row items-center mb-1">
                            <Building2 size={12} color="#9CA3AF" className="mr-1" />
                            <Text className="text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase ml-1">Kabupaten/Kota</Text>
                        </View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-base">
                             {detail.location?.regency || detail.snapshot?.regency || '-'}
                        </Text>
                    </View>
                    <View>
                        <View className="flex-row items-center mb-1">
                            <MapPin size={12} color="#9CA3AF" className="mr-1" />
                            <Text className="ml-1 text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase">Desa/Kelurahan</Text>
                        </View>
                        <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-base">
                             {detail.location?.village || detail.snapshot?.village || '-'}
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* Geo Coordinates */}
            <View className="bg-gray-50 rounded-2xl p-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-400 text-xs font-bold font-plus-jakarta-extrabold uppercase mb-2">Koordinat Geografis</Text>
                    <View className="flex-row space-x-6">
                        <View className='mr-4'>
                            <Text className="text-gray-400 text-xs font-bold mb-0.5">LAT</Text>
                            <Text className="text-gray-900 font-bold text-base font-plus-jakarta-extrabold">{detail.lat || '-'}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-400 text-xs font-bold mb-0.5">LONG</Text>
                            <Text className="text-gray-900 font-bold text-base font-plus-jakarta-extrabold">{detail.long || '-'}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity 
                    className="w-12 h-12 bg-white border border-gray-200 rounded-2xl items-center justify-center shadow-sm"
                    onPress={openGoogleMaps}
                >
                    {/* Using an image or a specific icon to represent Google Maps better if possible, otherwise MapIcon */}
                    <MapIcon size={24} color="#2563EB" /> 
                </TouchableOpacity>
            </View>
        </View>

        {/* Custom Tabs */}
        <View className="bg-white mx-5 rounded-full p-1.5 flex-row mb-6 shadow-sm border border-gray-100">
            <TouchableOpacity 
                className={`flex-1 py-3 rounded-full items-center ${activeTab === 'checklist' ? 'bg-orange-500 shadow-md' : 'bg-transparent'}`}
                onPress={() => setActiveTab('checklist')}
            >
                <Text className={`font-bold font-plus-jakarta-extrabold text-sm ${activeTab === 'checklist' ? 'text-white' : 'text-gray-400'}`}>Checklist</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className={`flex-1 py-3 rounded-full items-center ${activeTab === 'investor' ? 'bg-orange-500 shadow-md' : 'bg-transparent'}`}
                onPress={() => setActiveTab('investor')}
            >
                <Text className={`font-bold font-plus-jakarta-extrabold text-sm ${activeTab === 'investor' ? 'text-white' : 'text-gray-400'}`}>Investor</Text>
            </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="mx-5 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-h-[400px]">
            {activeTab === 'checklist' ? (
                <>
                    <View className="flex-row items-center mb-6">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                            <ListChecks size={20} color="#2563EB" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 font-plus-jakarta-extrabold">Checklist Persiapan</Text>
                    </View>
                    
                    <View className="space-y-4">
                        {checklistItems.map((item) => (
                             <View key={item.masterItemId} className="bg-gray-50 p-3 rounded-xl flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center flex-1 mr-2">
                                    <StatusIcon isCompleted={item.isCompleted} />
                                    <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-sm ml-3 flex-1">
                                        {item.name}
                                    </Text>
                                </View>
                                <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-sm">{item.weight}%</Text>
                             </View>
                        ))}
                    </View>
                </>
            ) : (
                <>
                   <View className="flex-row items-center mb-6">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                            <Briefcase size={20} color="#2563EB" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 font-plus-jakarta-extrabold">Investor Terkait</Text>
                   </View>

                   {detail.investor ? (
                        <>
                             {/* Investor Card */}
                             <View className="flex-row items-center mb-8">
                                <View className={`w-16 h-16 ${detail.investor.type === 'Individu' ? 'bg-orange-100' : 'bg-blue-100'} rounded-2xl items-center justify-center mr-4`}>
                                    {detail.investor.type === 'Individu' ? (
                                        <User size={32} color="#F97316" />
                                    ) : (
                                        <Text className="text-blue-600 font-bold text-xl">PT</Text>
                                    )}
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold mb-1">
                                        {detail.investor.type === 'Individu' ? 'Nama Investor' : 'Nama Perusahaan'}
                                    </Text>
                                    <Text className="text-gray-900 font-bold text-lg font-plus-jakarta-extrabold w-48">{detail.investor.name}</Text>
                                    {detail.investor.type === 'Individu' && (
                                        <View className="bg-orange-100 px-2 py-0.5 rounded-md self-start mt-1">
                                            <Text className="text-orange-700 text-[10px] font-bold">Individu</Text>
                                        </View>
                                    )}
                                </View>
                             </View>

                             {/* Contact Info */}
                             <View className="py-2">
                                <View className="bg-gray-50 p-4 rounded-2xl flex-row items-center justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <Mail size={18} color="#6B7280" className="mr-3" />
                                        <View className="ml-2">
                                            <Text className="text-gray-400 text-[10px] font-bold mb-0.5">Email Kontak</Text>
                                            <Text className="text-gray-900 font-bold text-sm font-plus-jakarta-extrabold">{detail.investor.email || '-'}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity 
                                        className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
                                        onPress={() => copyToClipboard(detail.investor.email || '')}
                                    >
                                        <Mail size={18} color="#2563EB" />
                                    </TouchableOpacity>
                                </View>

                                 <View className="bg-gray-50 p-4 rounded-2xl flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Building2 size={18} color="#6B7280" className="mr-3" />
                                        <View className="ml-2">
                                            <Text className="text-gray-400 text-[10px] font-bold mb-0.5">Kode Investor</Text>
                                            <Text className="text-gray-900 font-bold text-sm font-plus-jakarta-extrabold">{detail.investor.code || '-'}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity 
                                        className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
                                        onPress={() => copyToClipboard(detail.investor.code || '')}
                                    >
                                        <Copy size={18} color="#2563EB" />
                                    </TouchableOpacity>
                                </View>
                             </View>
                        </>
                   ) : (
                       <View className="items-center justify-center py-10">
                           <Text className="text-gray-400 font-plus-jakarta-semibold">Belum ada investor terkait</Text>
                       </View>
                   )}
                </>
            )}
        </View>

      </ScrollView>

      {/* Sticky Bottom Footer (Only for Checklist Tab for now based on design) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-6 border-t border-gray-100 shadow-lg">
          <View className="flex-row justify-between items-end mb-2">
              <Text className="text-gray-500 text-xs font-plus-jakarta-extrabold">Progress Persiapan</Text>
              <Text className="text-gray-900 font-bold text-xl font-plus-jakarta-extrabold">{percentage}%</Text>
          </View>
          <View className="h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
             <View className="h-full bg-lime-500 rounded-full" style={{ width: `${percentage}%` }} />
          </View>
          
          <TouchableOpacity 
            className="w-full bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-200"
            onPress={() => router.push(`/sppg/${id}/checklist`)}
            disabled={saving}
          >
             {saving ? (
                 <ActivityIndicator color="white" />
             ) : (
                 <>
                    <View className="bg-white rounded-full p-1 mr-2">
                        <CheckCircle size={16} color="#2563EB" />
                    </View>
                    <Text className="text-white font-bold text-base font-plus-jakarta-extrabold">Validasi Data Persiapan</Text>
                 </>
             )}
          </TouchableOpacity>
      </View>

    </View>
  );
}
