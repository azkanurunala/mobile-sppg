
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { 
  Users, 
  FileText, 
  Settings, 
  Search, 
  ClipboardCheck, 
  Scroll, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// 1. GLOBAL CARD STYLING (Soft Shadow Formula)
const SOFT_SHADOW = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 3,
};

interface DashboardStats {
  totalSPPG: number;
  averageProgress: number;
  summary: {
    assignInvestor: number;
    dokumenPendaftaran: number;
    prosesPersiapan: number;
    validasiData: number;
    appraisal: number;
    perjanjianSewa: number;
  };
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await fetchApi('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#356DF1" />
      </View>
    );
  }

  const getPercentage = (count: number) => {
    const total = stats?.totalSPPG || 1;
    return ((count / total) * 100).toFixed(1);
  };

  const SmallStatusCard = ({ 
    title, 
    count, 
    icon: Icon, 
    iconColor, 
    iconBg 
  }: { 
    title: string, 
    count: number, 
    icon: any, 
    iconColor: string, 
    iconBg: string 
  }) => (
    <View 
      className="bg-white p-5 rounded-[20px] w-[48%] mb-4 border border-gray-50"
      style={SOFT_SHADOW}
    >
      {/* 3. ICONOGRAPHY: Circle Container (48px), Pastel Bg */}
      <View className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${iconBg}`}>
        <Icon size={24} color={iconColor} />
      </View>

      {/* 5. TYPOGRAPHY: Title 14px SemiBold */}
      <Text className="text-gray-500 text-sm font-plus-jakarta-bold mb-2 leading-tight">
        {title}
      </Text>

      {/* 5. TYPOGRAPHY: Stats 24px+ Bold */}
      <Text className="text-3xl font-plus-jakarta-extrabold text-gray-900 mb-4">
        {count}
      </Text>
      
      {/* 4. PROGRESS BARS: Slim (6px), Track #F3F4F6 */}
      <View>
          <View className="flex-row justify-between mb-1.5">
               <Text className="text-[10px] text-gray-400 font-plus-jakarta-semibold">Persentase</Text>
               <Text className="text-[10px] text-gray-400 font-plus-jakarta-semibold">{getPercentage(count)}%</Text>
          </View>
          <View className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
             <View 
                className={`h-full rounded-full ${iconBg.replace('bg-', 'bg-').replace('/20', '')}`} 
                style={{ 
                    backgroundColor: iconColor, // Use the icon color for the bar indicator
                    width: `${Math.min(parseInt(getPercentage(count)), 100)}%` 
                }} 
             />
          </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      <View className="absolute top-0 left-0 right-0 h-[160px] bg-[#356DF1]" />

      <View className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
            {/* Header Content */}
            <View className="px-6 pt-14 pb-0 mb-4">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 mr-3">
                        <Text className="text-white font-plus-jakarta-extrabold text-lg">{user?.name?.substring(0,2).toUpperCase()}</Text>
                    </View>
                    <View>
                        <Text className="text-white font-plus-jakarta-extrabold text-xl">{user?.name}</Text>
                        <View className="flex-row items-center mt-0.5">
                            <MapPin size={12} color="#BFDBFE" className="mr-1" />
                            <Text className="text-blue-100 text-xs font-plus-jakarta-semibold">{user?.location || 'Lokasi belum diset'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Floating Summary Card (Total SPPG) - Overlapping the Header */}
            <View 
                className="mx-6 bg-white rounded-[20px] p-5 mb-8 flex-row justify-between items-center border border-gray-50 bg-white shadow-xl shadow-black/5"
                style={SOFT_SHADOW}
            >
                <View>
                    <Text className="text-gray-500 text-xs font-plus-jakarta-extrabold mb-1">Total SPPG Terdaftar</Text>
                    {/* Big Number Typography */}
                    <Text className="text-[40px] font-plus-jakarta-extrabold text-gray-900 leading-tight">
                        {stats?.totalSPPG || 0}
                    </Text>
                </View>
                <View className="bg-[#ECFDF5] px-3 py-1.5 rounded-full flex-row items-center border border-[#D1FAE5]">
                    <TrendingUp size={14} color="#10B981" className="mr-1" />
                    <Text className="text-[#059669] font-plus-jakarta-extrabold text-xs">+12%</Text>
                </View>
            </View>

            {/* Section Title */}
            <View className="px-6 mb-4 flex-row justify-between items-end">
                <Text className="text-lg font-plus-jakarta-extrabold text-gray-900">Status SPPG</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[#356DF1] font-plus-jakarta-extrabold text-sm mr-1">Detail</Text>
                    <ArrowRight size={16} color="#356DF1" />
                </TouchableOpacity>
            </View>

            {/* 2. HERO CARD (Validasi Data Persiapan) - Vibrant Blue #356DF1 */}
            <View className="mx-6 bg-[#356DF1] rounded-[24px] p-6 mb-0 overflow-hidden relative shadow-lg shadow-blue-500/30 z-20">
                 {/* Subtle Decoration: Opacity 0.05/0.1 */}
                 <View className="absolute -right-16 -top-16 w-48 h-48 bg-white opacity-5 rounded-full" />
                 <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full" />
                 
                 <View className="flex-row items-start mb-8 relative z-10">
                    <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mr-4 backdrop-blur-sm border border-white/10">
                        <ClipboardCheck size={28} color="white" />
                    </View>
                    <View className="flex-1 pt-1">
                        <Text className="text-blue-100 font-plus-jakarta-bold text-sm mb-1">Validasi Data Persiapan</Text>
                        <View className="flex-row items-baseline">
                            <Text className="text-[42px] font-plus-jakarta-extrabold text-white mr-2 leading-tight">
                                {stats?.summary.validasiData || 0}
                            </Text>
                            <Text className="text-blue-200 font-plus-jakarta-semibold text-lg">SPPG</Text>
                        </View>
                    </View>
                 </View>

                 <View className="relative z-10 pb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-blue-100 text-xs font-plus-jakarta-semibold">Persentase dari Total</Text>
                        <Text className="text-white text-xs font-plus-jakarta-extrabold">{getPercentage(stats?.summary.validasiData || 0)}%</Text>
                    </View>
                    {/* Progress Bar inside Hero Card */}
                    <View className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <View className="h-full rounded-full bg-white" style={{ width: `${getPercentage(stats?.summary.validasiData || 0)}%` as any }} />
                    </View>
                 </View>
            </View>

            {/* Progress Card - UNDER Hero Card (z-0) */}
            <View 
                className="mx-6 bg-white rounded-[20px] p-6 pt-12 mb-8 border border-gray-50 -mt-10 relative z-0"
                style={SOFT_SHADOW}
            >
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="text-gray-900 font-plus-jakarta-extrabold text-lg mb-1">Progres Persiapan</Text>
                        <Text className="text-gray-400 text-xs font-plus-jakarta-semibold">Rata-rata seluruh wilayah</Text>
                    </View>
                    {/* Circular Progress Indicator (Simulated) */}
                    <View className="w-14 h-14 rounded-full border-[4px] border-[#EFF6FF] items-center justify-center bg-white relative">
                         <Text className="text-[#356DF1] font-plus-jakarta-extrabold text-sm">{stats?.averageProgress || 0}%</Text>
                    </View>
                </View>
                
                {/* Slim Blue Progress Bar */}
                <View className="h-2 bg-[#F3F4F6] rounded-full mb-4 overflow-hidden">
                    <View className="h-full bg-[#356DF1] rounded-full" style={{ width: `${stats?.averageProgress || 0}%` }} />
                </View>
                
                <View className="flex-row justify-between pt-2 border-t border-gray-50">
                    <Text className="text-gray-400 text-[10px] font-plus-jakarta-semibold">Target: 100%</Text>
                    <Text className="text-gray-400 text-[10px] font-plus-jakarta-semibold">Deadline: 30 Jun 2024</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="px-6 flex-row flex-wrap justify-between">
                <SmallStatusCard 
                  title="Assign Investor" 
                  count={stats?.summary.assignInvestor || 0} 
                  icon={Users} 
                  iconColor="#3B82F6" 
                  iconBg="bg-[#EFF6FF]" // Blue-50 equivalent but explicit hex for pastel
                />
                <SmallStatusCard 
                  title="Dokumen Pendaftaran" 
                  count={stats?.summary.dokumenPendaftaran || 0} 
                  icon={FileText} 
                  iconColor="#F59E0B" 
                  iconBg="bg-[#FFFBEB]" // Amber-50
                />
                <SmallStatusCard 
                  title="Proses Persiapan" 
                  count={stats?.summary.prosesPersiapan || 0} 
                  icon={Settings} 
                  iconColor="#8B5CF6" 
                  iconBg="bg-[#F5F3FF]" // Violet-50
                />
                 <SmallStatusCard 
                  title="Appraisal Biaya Sewa" // Lengkapkan judul
                  count={stats?.summary.appraisal || 0} 
                  icon={Scroll} 
                  iconColor="#EC4899" 
                  iconBg="bg-[#FDF2F8]" // Pink-50
                />
                <SmallStatusCard 
                  title="Validasi Data Pendaftaran" 
                  count={stats?.summary.validasiData || 0} 
                  icon={ClipboardCheck} 
                  iconColor="#10B981" 
                  iconBg="bg-[#ECFDF5]" // Emerald-50
                />
                <SmallStatusCard 
                  title="Perjanjian Sewa" 
                  count={stats?.summary.perjanjianSewa || 0} 
                  icon={Briefcase} 
                  iconColor="#84CC16" 
                  iconBg="bg-[#F7FEE7]" // Lime-50
                />
            </View>
          
        </ScrollView>
      </View>
    </View>
  );
}
