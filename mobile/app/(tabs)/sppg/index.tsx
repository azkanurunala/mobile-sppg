
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, MapPin, ChevronRight, Briefcase } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchApi } from '@/lib/api';
import debounce from 'lodash/debounce';

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

const STATUS_FILTERS = ['Semua Status', 'Assign Investor', 'Dokumen Pendaftaran', 'Proses Persiapan', 'Validasi Data Persiapan', 'Appraisal Biaya Sewa', 'Validasi Data Pendaftaran', 'Perjanjian Sewa'];

export default function SPPGListScreen() {
  const router = useRouter();
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

  const renderItem = ({ item }: { item: SPPGItem }) => (
    <TouchableOpacity 
      className="bg-card p-4 rounded-xl mb-3 border border-border shadow-sm"
      onPress={() => router.push(`/sppg/${item.id}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
             <Text className="text-foreground font-bold font-plus-jakarta-bold text-base">{item.code}</Text>
             <View className="bg-primary/10 px-2 py-1 rounded-md self-start mt-1">
                <Text className="text-primary text-xs font-plus-jakarta-medium">{item.status}</Text>
             </View>
        </View>
        <View className="items-end">
             <Text className="text-foreground font-bold text-lg">{item.preparationProgress}%</Text>
             <Text className="text-muted-foreground text-xs">Progress</Text>
        </View>
      </View>
      
      <View className="border-t border-border my-2 pt-2 space-y-2">
         <View className="flex-row items-center">
            <Briefcase size={14} className="text-muted-foreground" />
            <Text className="text-muted-foreground text-sm ml-2 font-plus-jakarta-medium flex-1" numberOfLines={1}>
                {item.investor}
            </Text>
         </View>
         <View className="flex-row items-center">
            <MapPin size={14} className="text-muted-foreground" />
            <Text className="text-muted-foreground text-sm ml-2 font-plus-jakarta-medium flex-1" numberOfLines={1}>
                {item.location}
            </Text>
         </View>
      </View>

      <View className="mt-2 bg-primary py-2 rounded-lg items-center">
         <Text className="text-primary-foreground font-bold text-sm">Lihat Detail & Checklist</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-card px-4 py-3 border-b border-border">
        <Text className="text-xl font-bold text-foreground font-plus-jakarta-bold mb-3">Daftar SPPG</Text>
        
        {/* Search Bar */}
        <View className="flex-row bg-muted rounded-xl px-3 py-2 items-center mb-3">
            <Search size={20} className="text-muted-foreground" />
            <TextInput 
                className="flex-1 ml-2 font-plus-jakarta-medium text-foreground"
                placeholder="Cari Kode SPPG..."
                placeholderTextColor="#64748B"
                value={search}
                onChangeText={handleSearchChange}
            />
        </View>

        {/* Status Filter (Horizontal Scroll) */}
        <FlatList 
            data={STATUS_FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    className={`px-4 py-2 rounded-full mr-2 border ${selectedStatus === item ? 'bg-primary border-primary' : 'bg-card border-border'}`}
                    onPress={() => handleStatusChange(item)}
                >
                    <Text className={`font-plus-jakarta-medium text-xs ${selectedStatus === item ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
        />
      </View>

      {/* List */}
      <FlatList 
        data={sppgs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator className="mt-4" color="#2563EB" /> : null}
        ListEmptyComponent={!loading ? <Text className="text-center text-muted-foreground mt-10">Tidak ada data SPPG ditemukan</Text> : null}
      />
    </SafeAreaView>
  );
}
