
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, MapPin, Building2, SlidersHorizontal, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';
import debounce from 'lodash/debounce';
import { useAuth } from '@/context/AuthContext';

interface SPPGItem {
  id: string;
  code: string;
  investor: string;
  location: string;
  locationDetail: {
    village: string;
    district: string;
    regency: string;
  }
  status: string;
  preparationProgress: number;
}

const STATUS_FILTERS = ['Semua Status', 'Proses Persiapan', 'Validasi Data Persiapan', 'Dokumen Pendaftaran', 'Assign Investor'];

export default function SPPGListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [sppgs, setSppgs] = useState<SPPGItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const fetchSPPGs = async (pageNum: number, statusFilter: string, searchQuery: string, reset = false) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const params: any = {
        page: pageNum.toString(),
        limit: '10',
      };
      
      if (statusFilter !== 'Semua Status') {
        params.status = statusFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await fetchApi('/sppg', { params });
      
      if (reset) {
        setSppgs(response.data);
      } else {
        setSppgs(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error('Failed to fetch SPPGs', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
       setPage(1);
       setHasMore(true);
       fetchSPPGs(1, selectedStatus, query, true);
    }, 500),
    [selectedStatus] // dependency on status
  );

  const handleSearchChange = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
    setHasMore(true);
    fetchSPPGs(1, status, search, true);
  };

  useEffect(() => {
    fetchSPPGs(1, 'Semua Status', '', true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSPPGs(nextPage, selectedStatus, search);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchSPPGs(1, selectedStatus, search, true);
  };

  const getStatusColor = (status: string) => {
      const lower = status.toLowerCase();
      if (lower.includes('assign')) return 'bg-blue-100 text-blue-700';
      if (lower.includes('dokumen')) return 'bg-purple-100 text-purple-700';
      if (lower.includes('persiapan')) return 'bg-orange-100 text-orange-700';
      if (lower.includes('validasi')) return 'bg-emerald-100 text-emerald-700';
      if (lower.includes('sewa')) return 'bg-green-100 text-green-700';
      return 'bg-gray-100 text-gray-700';
  };

  const renderItem = ({ item }: { item: SPPGItem }) => {
    const statusStyle = getStatusColor(item.status);
    const bgClass = statusStyle.split(' ')[0];
    const textClass = statusStyle.split(' ')[1];

    const showProgress = ['Proses Persiapan', 'Validasi Data Persiapan'].includes(item.status) || item.preparationProgress > 0;
    const showActionButton = ['Validasi Data Persiapan', 'Proses Persiapan'].includes(item.status);

    return (
        <TouchableOpacity 
          className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100"
          onPress={() => router.push(`/sppg/${item.id}`)}
          activeOpacity={0.9}
        >
          {/* Header Card */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
                 <Text className="text-[10px] text-gray-400 font-bold font-plus-jakarta-bold tracking-widest mb-1">KODE SPPG</Text>
                 <Text className="text-gray-900 font-bold font-plus-jakarta-bold text-lg">{item.code}</Text>
            </View>
            <View className={`${bgClass} px-3 py-1.5 rounded-full`}>
                <Text className={`${textClass} text-[10px] font-bold font-plus-jakarta-bold`}>{item.status}</Text>
            </View>
          </View>
          
          {/* Info Rows */}
          <View className="flex-row mb-4">
             <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                    <Building2 size={12} className="text-gray-400 mr-1" />
                    <Text className="text-gray-400 text-[10px] font-plus-jakarta-bold">Investor</Text>
                </View>
                <Text className="text-gray-900 text-sm font-plus-jakarta-bold" numberOfLines={1}>
                    {item.investor || '-'}
                </Text>
             </View>
             <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <MapPin size={12} className="text-gray-400 mr-1" />
                    <Text className="text-gray-400 text-[10px] font-plus-jakarta-bold">Lokasi</Text>
                </View>
                <Text className="text-gray-900 text-sm font-plus-jakarta-bold" numberOfLines={1}>
                    {item.location || '-'}
                </Text>
             </View>
          </View>

          {/* Progress Bar (Conditional) */}
          {showProgress && (
              <View className="mb-4">
                  <View className="flex-row justify-between mb-1">
                      <Text className="text-[10px] text-gray-400 font-plus-jakarta-medium">Persentase Persiapan</Text>
                      <Text className="text-[10px] text-lime-600 font-bold font-plus-jakarta-bold">{item.preparationProgress}%</Text>
                  </View>
                  <View className="h-2 bg-orange-50/50 rounded-full overflow-hidden">
                      <View className="h-full bg-lime-500 rounded-full" style={{ width: `${item.preparationProgress}%` }} />
                  </View>
              </View>
          )}

          {/* Action Button (Conditional) */}
          {showActionButton && (
              <View className="mt-1 bg-blue-600 py-3 rounded-xl items-center shadow-md shadow-blue-200">
                 <Text className="text-white font-bold text-sm font-plus-jakarta-bold">
                    {item.status.includes('Validasi') ? 'Perbarui Validasi Data' : 'Validasi Data Persiapan'}
                 </Text>
              </View>
          )}
        </TouchableOpacity>
      );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      {/* Blue Header Container */}
      <View className="bg-blue-600 pt-12 pb-6 px-5 rounded-b-[30px] z-10 shadow-lg shadow-blue-900/20">
        
        {/* Title Row */}
        <View className="flex-row justify-between items-start mb-6">
            <View>
                <View className="flex-row items-center mb-1">
                    <View className="bg-white/20 p-1.5 rounded-lg mr-2">
                        <Text className="text-white font-bold text-xs">SP</Text>
                    </View>
                    <Text className="text-2xl font-bold text-white font-plus-jakarta-bold">Daftar SPPG</Text>
                </View>
                <View className="flex-row items-center ml-1">
                    <MapPin size={12} color="#BFDBFE" className="mr-1" />
                    <Text className="text-blue-100 text-xs font-plus-jakarta-medium">
                        {user?.location || 'Lokasi belum diset'}
                    </Text>
                </View>
            </View>
            <View className="flex-row space-x-2">
                <TouchableOpacity className="bg-white/20 w-10 h-10 rounded-full items-center justify-center border border-white/10">
                    <SlidersHorizontal size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-white/20 w-10 h-10 rounded-full items-center justify-center border border-white/10">
                    <Trash2 size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row bg-blue-500/50 border border-blue-400/30 rounded-2xl px-4 py-3 items-center mb-6">
            <Search size={20} color="#BFDBFE" />
            <TextInput 
                className="flex-1 ml-3 font-plus-jakarta-medium text-white"
                placeholder="Cari Kode SPPG..."
                placeholderTextColor="#BFDBFE"
                value={search}
                onChangeText={handleSearchChange}
            />
        </View>

        {/* Status Filter (Horizontal Scroll) */}
        <View>
            <FlatList 
                data={STATUS_FILTERS}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item}
                contentContainerStyle={{ paddingRight: 20 }}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        className={`px-5 py-2.5 rounded-full mr-2 ${selectedStatus === item ? 'bg-white shadow-sm' : 'bg-blue-800/30 border border-blue-400/30'}`}
                        onPress={() => handleStatusChange(item)}
                    >
                        <Text className={`font-bold text-xs font-plus-jakarta-bold ${selectedStatus === item ? 'text-blue-700' : 'text-blue-100'}`}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
      </View>

      {/* List Content */}
      <View className="flex-1 px-5 -mt-4">
          <Text className="text-gray-500 text-xs font-plus-jakarta-medium mb-4 ml-1">Menampilkan hasil pencarian berdasarkan data terbaru</Text>
          <FlatList 
            data={sppgs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && !refreshing ? <ActivityIndicator className="mt-4" color="#2563EB" /> : null}
            ListEmptyComponent={!loading ? <View className="items-center py-10"><Text className="text-gray-400 font-plus-jakarta-medium">Tidak ada data ditemukan</Text></View> : null}
          />
      </View>

    </View>
  );
}
