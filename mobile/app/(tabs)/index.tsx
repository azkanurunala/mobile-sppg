
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { Layers, FileText, CheckCircle, Search, ClipboardCheck, Scroll, Building2, MapPin } from 'lucide-react-native';

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
    <View className="bg-card p-4 rounded-xl border border-border shadow-sm w-[48%] mb-4">
      <View className={`w-10 h-10 rounded-full items-center justify-center mb-3 ${color}`}>
        <Icon size={20} color="white" />
      </View>
      <Text className="text-2xl font-bold text-foreground mb-1 font-plus-jakarta-bold">{count}</Text>
      <Text className="text-xs text-muted-foreground font-plus-jakarta-medium">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView 
        className="flex-1 px-5 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-muted-foreground font-plus-jakarta-medium text-sm">Selamat Datang,</Text>
            <Text className="text-2xl font-bold text-foreground font-plus-jakarta-bold">{user?.name}</Text>
            {user?.location && (
                <View className="flex-row items-center mt-1">
                    <MapPin size={12} className="text-primary mr-1" />
                    <Text className="text-xs text-primary font-plus-jakarta-bold">{user.location}</Text>
                </View>
            )}
          </View>
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center border border-primary/20">
             <Text className="text-primary font-bold text-lg font-plus-jakarta-bold">{user?.name?.charAt(0)}</Text>
          </View>
        </View>

        {/* Main Stats Card */}
        <View className="bg-primary rounded-2xl p-6 mb-8 shadow-lg shadow-blue-200/50">
          <View className="flex-row justify-between items-start mb-6">
             <View>
                <Text className="text-primary-foreground/80 font-plus-jakarta-medium text-sm mb-1">Total SPPG Terdaftar</Text>
                <Text className="text-5xl font-bold text-primary-foreground font-plus-jakarta-bold">{stats?.totalSPPG || 0}</Text>
             </View>
             <View className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Layers color="white" size={24} />
             </View>
          </View>
          
          <View className="bg-black/10 rounded-xl p-4 flex-row items-center backdrop-blur-md">
             <View className="bg-white/20 p-2 rounded-lg mr-3">
                <CheckCircle size={18} color="white" />
             </View>
             <View>
                <Text className="text-primary-foreground/90 text-xs font-plus-jakarta-medium">Progress Rata-rata</Text>
                <Text className="text-white font-bold text-base font-plus-jakarta-bold">{stats?.averageProgress || 0}% Selesai</Text>
             </View>
          </View>
        </View>

        {/* Section Title */}
        <Text className="text-lg font-bold text-foreground mb-4 font-plus-jakarta-bold">Ringkasan Status</Text>

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
