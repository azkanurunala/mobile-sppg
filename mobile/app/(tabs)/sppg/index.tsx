import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, MapPin, Building2, SlidersHorizontal, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';
import debounce from 'lodash/debounce';
import { useAuth } from '@/context/AuthContext';
import SkeletonItem from '@/components/ui/SkeletonItem';

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

  // Race Condition Handling
  const activeRequestId = useRef(0);

  const fetchSPPGs = async (pageNum: number, statusFilter: string, searchQuery: string, reset = false) => {
    const requestId = ++activeRequestId.current;
    
    if (loading && !reset && pageNum > 1) return; // Prevent creating multiple requests for pagination
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
      
      // If a newer request has started, ignore this result
      if (requestId !== activeRequestId.current) {
        return;
      }

      if (reset) {
        setSppgs(response.data);
      } else {
        setSppgs(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
    } catch (error) {
      if (requestId === activeRequestId.current) {
         console.error('Failed to fetch SPPGs', error);
      }
    } finally {
      if (requestId === activeRequestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Debounced Search Handler
  const debouncedFetch = useCallback(
    debounce((query: string, status: string) => {
        // Reset page and trigger fetch
        setPage(1);
        setHasMore(true);
        fetchSPPGs(1, status, query, true);
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearch(text);
    // Optimistic UI update or just wait for debounce?
    // We wait for debounce to fetch, but state is updated immediately for the input
    debouncedFetch(text, selectedStatus);
  };

  const handleStatusChange = (status: string) => {
    if (status === selectedStatus) return;
    setSelectedStatus(status);
    setPage(1);
    setHasMore(true);
    // Clear list immediately to show skeleton and prevent old data from showing
    setSppgs([]); 
    fetchSPPGs(1, status, search, true);
  };

  useEffect(() => {
    fetchSPPGs(1, 'Semua Status', '', true);
    return () => {
      debouncedFetch.cancel();
    };
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
      if (lower.includes('assign')) return 'bg-gray-100 text-gray-700';
      if (lower.includes('dokumen')) return 'bg-purple-100 text-purple-700';
      if (lower.includes('validasi')) return 'bg-blue-100 text-blue-700';
      if (lower.includes('persiapan')) return 'bg-orange-100 text-orange-700';
      if (lower.includes('sewa')) return 'bg-green-100 text-green-700';
      return 'bg-gray-100 text-gray-700';
  };

  const renderItem = useCallback(({ item, index }: { item: SPPGItem, index: number }) => {
    const statusStyle = getStatusColor(item.status);
    const bgClass = statusStyle.split(' ')[0];
    const textClass = statusStyle.split(' ')[1];

    const showProgress = ['Proses Persiapan', 'Validasi Data Persiapan'].includes(item.status) || item.preparationProgress > 0;
    const showActionButton = ['Validasi Data Persiapan', 'Proses Persiapan'].includes(item.status);

    return (
        <Pressable 
          className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100 active:opacity-90"
          style={{ marginTop: index === 0 ? 20 : 0 }}
          onPress={() => router.push(`/sppg/${item.id}`)}
        >
          {/* Header Card */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
                 <Text className="text-[10px] text-gray-400 font-bold font-plus-jakarta-extrabold tracking-widest mb-1">KODE SPPG</Text>
                 <Text className="text-gray-900 font-bold font-plus-jakarta-extrabold text-lg">{item.code}</Text>
            </View>
            <View className={`${bgClass} px-3 py-1.5 rounded-full`}>
                <Text className={`${textClass} text-[10px] font-bold font-plus-jakarta-extrabold`}>{item.status}</Text>
            </View>
          </View>
          
          {/* Info Rows */}
          <View className="mb-4 space-y-2">
              <View className="flex-row items-start">
                  <View className="flex-row items-center w-[25%]">
                      <Building2 size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                      <Text className="text-gray-500 text-xs font-plus-jakarta-semibold">Investor</Text>
                  </View>
                  <Text className="text-gray-900 text-sm font-plus-jakarta-extrabold w-[75%]" numberOfLines={1}>
                      {item.investor || '-'}
                  </Text>
              </View>
              <View className="flex-row items-start">
                  <View className="flex-row items-center w-[25%]">
                      <MapPin size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                      <Text className="text-gray-500 text-xs font-plus-jakarta-semibold">Lokasi</Text>
                  </View>
                  <Text className="text-gray-900 text-sm font-plus-jakarta-extrabold w-[75%]" numberOfLines={1}>
                      {item.locationDetail 
                        ? `Kel. ${item.locationDetail.village}, Kec. ${item.locationDetail.district}, ${item.locationDetail.regency}`
                        : (item.location || '-')}
                  </Text>
              </View>
          </View>

          {/* Progress Bar (Conditional) */}
          {showProgress && (
              <View className="mb-4">
                  <View className="flex-row justify-between mb-1">
                      <Text className="text-[10px] text-gray-400 font-plus-jakarta-semibold">Persentase Persiapan</Text>
                      <Text className="text-[10px] text-lime-600 font-bold font-plus-jakarta-extrabold">{item.preparationProgress}%</Text>
                  </View>
                  <View className="h-2 bg-orange-50/50 rounded-full overflow-hidden">
                      <View className="h-full bg-lime-500 rounded-full" style={{ width: `${item.preparationProgress}%` }} />
                  </View>
              </View>
          )}

          {/* Action Button (Conditional) */}
          {showActionButton && (
              <Pressable 
                className="mt-1 bg-blue-600 py-3 rounded-2xl items-center shadow-md shadow-blue-200 active:bg-blue-700"
                onPress={() => router.push(`/sppg/${item.id}/checklist`)}
              >
                 <Text className="text-white font-bold text-sm font-plus-jakarta-extrabold">
                    {item.status.includes('Validasi') ? 'Perbarui Validasi Data' : 'Validasi Data Persiapan'}
                 </Text>
              </Pressable>
          )}
        </Pressable>
      );
  }, [router]);

  const renderFilterItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
        className={`px-5 py-2.5 rounded-full mr-2 ${selectedStatus === item ? 'bg-white shadow-sm' : 'bg-blue-800/30 border border-blue-400/30'}`}
        onPress={() => handleStatusChange(item)}
        activeOpacity={0.7}
    >
        <Text className={`font-bold text-xs font-plus-jakarta-extrabold ${selectedStatus === item ? 'text-blue-700' : 'text-blue-100'}`}>
            {item}
        </Text>
    </TouchableOpacity>
  ), [selectedStatus]);

  const renderSkeleton = () => {
    return (
      <View className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100 mt-5">
        <View className="flex-row justify-between mb-4">
          <View>
             <SkeletonItem width={60} height={10} style={{ marginBottom: 6 }} />
             <SkeletonItem width={100} height={20} />
          </View>
          <SkeletonItem width={80} height={24} borderRadius={20} />
        </View>
        <View className="space-y-3 mb-4">
          <SkeletonItem width="100%" height={16} />
          <SkeletonItem width="80%" height={16} />
        </View>
        <SkeletonItem width="40%" height={40} borderRadius={16} />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      {/* Blue Header Container */}
      <View className="bg-blue-600 pt-12 pb-4 z-10 shadow-lg shadow-blue-900/20">
        
        {/* Title Row */}
        <View className="flex-row justify-between items-start mb-6 mx-5">
            <View>
                <View className="flex-row items-center mb-1">
                    <Text className="text-2xl font-bold text-white font-plus-jakarta-extrabold">Daftar SPPG</Text>
                </View>
                <View className="flex-row items-center ml-1">
                    <MapPin size={16} color="#BFDBFE" className="mr-1" />
                    <Text className="ml-2 text-blue-100 text-sm font-plus-jakarta-semibold">
                        {user?.location || 'Lokasi belum diset'}
                    </Text>
                </View>
            </View>
            <View className="flex-row space-x-2">
                <Pressable className="bg-white/20 w-10 h-10 rounded-full items-center justify-center border border-white/10 active:bg-white/30">
                    <SlidersHorizontal size={20} color="white" />
                </Pressable>
            </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row bg-blue-500/50 border border-blue-400/30 rounded-2xl px-4 py-1 items-center mb-4 mx-5">
            <Search size={20} color="#BFDBFE" />
            <TextInput 
                className="flex-1 ml-3 font-plus-jakarta-semibold text-white"
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
                contentContainerStyle={{ paddingHorizontal: 20 }}
                extraData={selectedStatus}
                renderItem={renderFilterItem}
            />
        </View>
      </View>

      {/* List Content */}
      <View className="flex-1 px-5">
          {loading && page === 1 && !refreshing ? (
             <View>
                {[1, 2, 3].map((key) => (
                  <View key={key}>{renderSkeleton()}</View>
                ))}
             </View>
          ) : (
             <FlatList 
                data={sppgs}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                ListFooterComponent={loading && !refreshing ? <ActivityIndicator className="mt-4" color="#2563EB" /> : null}
                ListEmptyComponent={!loading ? <View className="items-center py-10"><Text className="text-gray-400 font-plus-jakarta-semibold">Tidak ada data ditemukan</Text></View> : null}
            />
          )}
      </View>
    </View>
  );
}
