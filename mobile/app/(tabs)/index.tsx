
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Calculate percentages (mock logic for now, ideally backend provides total bases)
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
    <View className="bg-white p-4 rounded-2xl border border-gray-100 w-[48%] mb-4 shadow-sm">
      <View className={`w-10 h-10 rounded-full items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text className="text-gray-500 font-plus-jakarta-bold text-xs mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900 font-plus-jakarta-bold mb-2">{count}</Text>
      
      {/* Progress Bar Mock */}
      <View className="flex-row items-center justify-between">
          <View className="h-1.5 flex-1 bg-gray-100 rounded-full mr-2 overflow-hidden">
             <View className={`h-full rounded-full ${iconBg.replace('bg-', 'bg-').replace('/20', '')}`} style={{ width: `${Math.min(parseInt(getPercentage(count)), 100)}%` }} />
          </View>
          <Text className="text-[10px] text-gray-400 font-plus-jakarta-medium">{getPercentage(count)}%</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      {/* Blue Header Background */}
      <View className="absolute top-0 left-0 right-0 h-[280px] bg-blue-600 rounded-b-[40px]" />

      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header Content */}
            <View className="px-6 pt-2 pb-6">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 mr-3">
                        <Text className="text-white font-bold text-lg font-plus-jakarta-bold">{user?.name?.substring(0,2).toUpperCase()}</Text>
                    </View>
                    <View>
                        <Text className="text-white font-bold text-lg font-plus-jakarta-bold">{user?.name}</Text>
                        <View className="flex-row items-center">
                            <MapPin size={12} color="#BFDBFE" className="mr-1" />
                            <Text className="text-blue-100 text-xs font-plus-jakarta-medium">{user?.location || 'Lokasi belum diset'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Floating Summary Card */}
            <View className="mx-6 bg-white rounded-2xl p-5 shadow-lg shadow-blue-900/10 mb-6 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-500 text-xs font-plus-jakarta-bold mb-1">Total SPPG Terdaftar</Text>
                    <Text className="text-4xl font-bold text-gray-900 font-plus-jakarta-bold">{stats?.totalSPPG || 0}</Text>
                </View>
                <View className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                    <TrendingUp size={14} color="#16A34A" className="mr-1" />
                    <Text className="text-green-600 font-bold text-xs font-plus-jakarta-bold">+12%</Text>
                </View>
            </View>

            {/* Status SPPG Section */}
            <View className="px-6 mb-4 flex-row justify-between items-end">
                <Text className="text-lg font-bold text-gray-900 font-plus-jakarta-bold">Status SPPG</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-blue-600 font-bold text-sm mr-1 font-plus-jakarta-bold">Detail</Text>
                    <ArrowRight size={16} color="#2563EB" />
                </TouchableOpacity>
            </View>

            {/* Hero Card */}
            <View className="mx-6 bg-blue-500 rounded-3xl p-6 shadow-xl shadow-blue-500/30 mb-6 overflow-hidden relative">
                 {/* Decorative Circle */}
                 <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                 <View className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
                 
                 <View className="flex-row items-start mb-6">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4 backdrop-blur-sm">
                        <ClipboardCheck size={24} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-blue-100 font-plus-jakarta-bold text-sm">Validasi Data Persiapan</Text>
                        <View className="flex-row items-end">
                            <Text className="text-4xl font-bold text-white font-plus-jakarta-bold mr-2">{stats?.summary.prosesPersiapan || 0}</Text>
                            <Text className="text-blue-100 font-plus-jakarta-medium mb-1.5">SPPG</Text>
                        </View>
                    </View>
                 </View>

                 <View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-blue-100 text-xs font-plus-jakarta-medium">Persentase dari Total</Text>
                        <Text className="text-white text-xs font-bold font-plus-jakarta-bold">{getPercentage(stats?.summary.prosesPersiapan || 0)}%</Text>
                    </View>
                    <View className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <View className="h-full bg-white rounded-full" style={{ width: `${getPercentage(stats?.summary.prosesPersiapan || 0)}%` }} />
                    </View>
                 </View>
            </View>

            {/* Progress Card */}
            <View className="mx-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-gray-900 font-bold text-base font-plus-jakarta-bold">Progres Persiapan</Text>
                        <Text className="text-gray-500 text-xs font-plus-jakarta-medium">Rata-rata seluruh wilayah</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full border-4 border-blue-100 items-center justify-center">
                         <Text className="text-blue-600 font-bold text-xs">{stats?.averageProgress || 0}%</Text>
                    </View>
                </View>
                
                <View className="h-3 bg-gray-100 rounded-full mb-3 overflow-hidden">
                    <View className="h-full bg-blue-500 rounded-full" style={{ width: `${stats?.averageProgress || 0}%` }} />
                </View>
                
                <View className="flex-row justify-between">
                    <Text className="text-gray-500 text-xs font-plus-jakarta-medium">Target: 100%</Text>
                    <Text className="text-gray-500 text-xs font-plus-jakarta-medium">Deadline: 30 Jun 2024</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="px-6 flex-row flex-wrap justify-between">
                <SmallStatusCard 
                  title="Assign Investor" 
                  count={stats?.summary.assignInvestor || 0} 
                  icon={Users} 
                  iconColor="#3B82F6" 
                  iconBg="bg-blue-50"
                />
                <SmallStatusCard 
                  title="Dokumen Pendaftaran" 
                  count={stats?.summary.dokumenPendaftaran || 0} 
                  icon={FileText} 
                  iconColor="#F59E0B" 
                  iconBg="bg-amber-50"
                />
                <SmallStatusCard 
                  title="Proses Persiapan" 
                  count={stats?.summary.prosesPersiapan || 0} 
                  icon={Settings} 
                  iconColor="#8B5CF6" 
                  iconBg="bg-violet-50"
                />
                 <SmallStatusCard 
                  title="Appraisal Biaya" 
                  count={stats?.summary.appraisal || 0} 
                  icon={Scroll} 
                  iconColor="#EC4899" 
                  iconBg="bg-pink-50"
                />
                <SmallStatusCard 
                  title="Validasi Data" 
                  count={stats?.summary.validasiData || 0} 
                  icon={ClipboardCheck} 
                  iconColor="#10B981" 
                  iconBg="bg-emerald-50"
                />
                <SmallStatusCard 
                  title="Perjanjian Sewa" 
                  count={stats?.summary.perjanjianSewa || 0} 
                  icon={Briefcase} 
                  iconColor="#84CC16" 
                  iconBg="bg-lime-50"
                />
            </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
