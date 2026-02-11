import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { X, ChevronDown, MapPin } from 'lucide-react-native';
import { fetchApi } from '@/lib/api';
import SelectionModal from '@/components/ui/SelectionModal';
import { useAuth } from '@/context/AuthContext';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { sort: string; districtId: string; villageId: string; districtName: string; villageName: string }) => void;
  currentFilters: { sort: string; districtId: string; villageId: string; districtName: string; villageName: string };
}

const SORT_OPTIONS = [
  { label: 'Terbaru', value: 'created_at:desc' },
  { label: 'Terlama', value: 'created_at:asc' },
  { label: 'Kode A-Z', value: 'code:asc' },
  { label: 'Kode Z-A', value: 'code:desc' },
];

export default function FilterModal({ visible, onClose, onApply, currentFilters }: FilterModalProps) {
  const { user } = useAuth();
  const [sort, setSort] = useState(currentFilters.sort);
  const [district, setDistrict] = useState(currentFilters.districtName);
  const [village, setVillage] = useState(currentFilters.villageName);
  const [districtId, setDistrictId] = useState(currentFilters.districtId);
  const [villageId, setVillageId] = useState(currentFilters.villageId);

  // Searchable Select State
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [villages, setVillages] = useState<{id: string, name: string}[]>([]);
  const [showDistrictSelect, setShowDistrictSelect] = useState(false);
  const [showVillageSelect, setShowVillageSelect] = useState(false);
  
  // Fetch Districts on Mount (or when visible)
  useEffect(() => {
    if (visible && user) {
        fetchDistricts();
    }
  }, [visible, user]);

  // Sync props to state
  useEffect(() => {
    if (visible) {
      setSort(currentFilters.sort);
      setDistrict(currentFilters.districtName);
      setVillage(currentFilters.villageName);
      setDistrictId(currentFilters.districtId);
      setVillageId(currentFilters.villageId);
    }
  }, [visible, currentFilters]);

  // Fetch Villages when District ID changes
  useEffect(() => {
      if (districtId) {
          fetchVillages(districtId);
      } else {
          setVillages([]);
      }
  }, [districtId]);

  const fetchDistricts = async () => {
    try {
        // Accessing regencyId from user context
        const regencyId = user?.regencyId;
        
        const params: any = {};
        if (regencyId) {
            params.regencyId = regencyId;
        }

        const data = await fetchApi('/wilayah/districts', { params });
        setDistricts(data);
    } catch (error) {
        console.error('Failed to fetch districts', error);
    }
  };

  const fetchVillages = async (distId: string) => {
    try {
        const data = await fetchApi(`/wilayah/villages?districtId=${distId}`);
        setVillages(data);
    } catch (error) {
        console.error('Failed to fetch villages', error);
    }
  };

  const handleReset = () => {
    setSort('created_at:desc');
    setDistrict('');
    setVillage('');
    setDistrictId('');
    setVillageId('');
    setVillages([]);
  };

  const handleApply = () => {
    onApply({ sort, districtId, villageId, districtName: district, villageName: village });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[32px] p-6 h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold font-plus-jakarta-extrabold text-gray-900">Filter & Urutkan</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort Section */}
            <View className="mb-6">
              <Text className="text-sm font-bold font-plus-jakarta-extrabold text-gray-500 mb-4 uppercase tracking-wider">Urutkan Berdasarkan</Text>
              <View className="flex-row flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setSort(option.value)}
                    className={`px-4 py-2.5 rounded-xl border ${
                      sort === option.value
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-bold font-plus-jakarta-semibold text-sm ${
                        sort === option.value ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* divider */}
            <View className="h-[1px] bg-gray-100 mb-6" />

            {/* Location Filter Section */}
            <View className="mb-6">
              <Text className="text-sm font-bold font-plus-jakarta-extrabold text-gray-500 mb-4 uppercase tracking-wider">Lokasi</Text>
              
              <View className="mb-4">
                <Text className="text-gray-900 font-bold font-plus-jakarta-semibold text-sm mb-2">Kecamatan</Text>
                <TouchableOpacity 
                    className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-[50px]"
                    onPress={() => setShowDistrictSelect(true)}
                >
                    <Text className={`flex-1 font-plus-jakarta-semibold ${district ? 'text-gray-900' : 'text-gray-400'}`}>
                        {district || 'Pilih Kecamatan'}
                    </Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-gray-900 font-bold font-plus-jakarta-semibold text-sm mb-2">Desa/Kelurahan</Text>
                <TouchableOpacity 
                    className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-[50px]"
                    onPress={() => {
                        if (district) {
                            setShowVillageSelect(true);
                        } else {
                            // Optionally alert user to select district first
                        }
                    }}
                    activeOpacity={district ? 0.7 : 0.5}
                >
                    <Text className={`flex-1 font-plus-jakarta-semibold ${village ? 'text-gray-900' : 'text-gray-400'}`}>
                        {village || 'Pilih Desa/Kelurahan'}
                    </Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                </TouchableOpacity>
                {!district && (
                    <Text className="text-xs text-orange-500 mt-1 font-plus-jakarta-medium">
                        Pilih kecamatan terlebih dahulu
                    </Text>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row gap-3 pt-4 border-t border-gray-100 absolute bottom-6 left-6 right-6 bg-white">
            <TouchableOpacity 
                className="flex-1 h-12 rounded-2xl items-center justify-center border border-gray-200 bg-white"
                onPress={handleReset}
            >
                <Text className="text-gray-600 font-bold font-plus-jakarta-extrabold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className="flex-1 h-12 rounded-2xl items-center justify-center bg-blue-600 shadow-md shadow-blue-200"
                onPress={handleApply}
            >
                <Text className="text-white font-bold font-plus-jakarta-extrabold">Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals */}
        <SelectionModal 
            visible={showDistrictSelect}
            items={districts}
            onSelect={(id) => {
                const selected = districts.find(d => d.id === id);
                if (selected) {
                    setDistrict(selected.name);
                    setDistrictId(id);
                    setVillage(''); // Reset village name
                    setVillageId(''); // Reset village id
                }
            }}
            onClose={() => setShowDistrictSelect(false)}
            title="Pilih Kecamatan"
        />

        <SelectionModal 
            visible={showVillageSelect}
            items={villages}
            onSelect={(id) => {
                const selected = villages.find(v => v.id === id);
                if (selected) {
                    setVillage(selected.name);
                    setVillageId(id);
                }
            }}
            onClose={() => setShowVillageSelect(false)}
            title="Pilih Desa/Kelurahan"
        />

      </View>
    </Modal>
  );
}
