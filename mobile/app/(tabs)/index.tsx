
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { Layers, FileText, CheckCircle, Search, ClipboardCheck, Scroll, Building2 } from 'lucide-react-native';

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

  // Helper to render card
  const StatusCard = ({ title, count, icon: Icon, color }: { title: string, count: number, icon: any, color: string }) => (
    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-[48%] mb-4">
      <View className={`w-10 h-10 rounded-full items-center justify-center mb-3 ${color}`}>
        <Icon size={20} color="white" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">{count}</Text>
      <Text className="text-xs text-gray-500 font-plus-jakarta-medium">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 font-plus-jakarta-medium text-sm">Selamat Datang,</Text>
            <Text className="text-xl font-bold text-gray-900 font-plus-jakarta-bold">{user?.name}</Text>
            {user?.location && (
                <Text className="text-xs text-blue-600 mt-1">{user.location}</Text>
            )}
          </View>
          <View className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
             {/* Profile Avatar Placeholder */}
             <View className="flex-1 items-center justify-center bg-blue-100">
                <Text className="text-blue-600 font-bold">{user?.name?.charAt(0)}</Text>
             </View>
          </View>
        </View>

        {/* Main Stats Card */}
        <View className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-md shadow-blue-200">
          <View className="flex-row justify-between items-start">
             <View>
                <Text className="text-blue-100 font-plus-jakarta-medium text-sm mb-1">Total SPPG Terdaftar</Text>
                <Text className="text-4xl font-bold text-white mb-4">{stats?.totalSPPG || 0}</Text>
             </View>
             <View className="bg-blue-500 p-2 rounded-lg">
                <Layers color="white" size={24} />
             </View>
          </View>
          
          <View className="bg-blue-700/50 rounded-xl p-3 flex-row items-center">
             <View className="bg-white/20 p-2 rounded-lg mr-3">
                <ActivityIndicator color="white" style={{display: 'none'}} /> 
                <CheckCircle size={16} color="white" />
             </View>
             <View>
                <Text className="text-blue-100 text-xs">Progress Rata-rata</Text>
                <Text className="text-white font-bold">{stats?.averageProgress || 0}% Selesai</Text>
             </View>
          </View>
        </View>

        {/* Section Title */}
        <Text className="text-base font-bold text-gray-900 mb-4 font-plus-jakarta-bold">Ringkasan Status</Text>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between pb-10">
          <StatusCard 
            title="Assign Investor" 
            count={stats?.summary.assignInvestor || 0} 
            icon={Search} 
            color="bg-orange-500" 
          />
          <StatusCard 
            title="Dokumen Pendaftaran" 
            count={stats?.summary.dokumenPendaftaran || 0} 
            icon={FileText} 
            color="bg-purple-500" 
          />
          <StatusCard 
            title="Proses Persiapan" 
            count={stats?.summary.prosesPersiapan || 0} 
            icon={Building2} 
            color="bg-blue-500" 
          />
          <StatusCard 
            title="Validasi Data" 
            count={stats?.summary.validasiData || 0} 
            icon={ClipboardCheck} 
            color="bg-indigo-500" 
          />
          <StatusCard 
            title="Appraisal Biaya" 
            count={stats?.summary.appraisal || 0} 
            icon={Scroll} 
            color="bg-green-500" 
          />
           <StatusCard 
            title="Perjanjian Sewa" 
            count={stats?.summary.perjanjianSewa || 0} 
            icon={CheckCircle} 
            color="bg-emerald-600" 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
