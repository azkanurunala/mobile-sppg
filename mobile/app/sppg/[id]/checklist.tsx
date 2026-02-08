
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Info, Check, X, Trash2 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { fetchApi } from '@/lib/api';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface ChecklistItem {
  masterItemId: string;
  name: string;
  description: string; // Not used in UI but kept for data
  weight: number;
  isCompleted: boolean | null;
}

const SOFT_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

const FOOTER_SHADOW = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
};

export default function ValidationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [initialItems, setInitialItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isSavingRef = useRef(false); // Ref to track saving state synchronously
  const [summary, setSummary] = useState<any>(null);

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);

  const fetchChecklist = async () => {
    try {
        const data = await fetchApi(`/sppg/${id}/checklist`);
        setItems(data.checklist);
        setInitialItems(JSON.parse(JSON.stringify(data.checklist))); // Deep copy
        setSummary(data.summary);
        setLoading(false);
    } catch (error) {
        console.error('Failed to fetch checklist', error);
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id]);

  // Handle Unsaved Changes Warning
  useEffect(() => {
    // Helper to extract comparable state
    const getComparableState = (list: ChecklistItem[]) => 
        list.map(item => ({ id: item.masterItemId, status: item.isCompleted }));

    const currentState = JSON.stringify(getComparableState(items));
    const initialState = JSON.stringify(getComparableState(initialItems));
    const hasUnsavedChanges = currentState !== initialState;

    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges || isSavingRef.current) {
            // If we don't have unsaved changes, or we are currently saving, then we don't need to do anything
            return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Save the pending action and show custom modal
        setPendingAction(e.data.action);
        setShowConfirmModal(true);
    });

    return () => {
        navigation.removeListener('beforeRemove', beforeRemoveListener);
    };
  }, [items, initialItems, navigation]);

  const toggleItem = (masterItemId: string, status: boolean) => {
    setItems(prevItems => 
        prevItems.map(item => 
            item.masterItemId === masterItemId 
                ? { ...item, isCompleted: item.isCompleted === status ? null : status } 
                : item
        )
    );
  };

  const calculateProgress = () => {
      const currentWeight = items.reduce((sum, item) => item.isCompleted === true ? sum + item.weight : sum, 0);
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0) || 100;
      return Math.round((currentWeight / totalWeight) * 100);
  };

  const handleSave = async () => {
    setSaving(true);
    isSavingRef.current = true; // Mark as saving synchronously
    try {
        await fetchApi(`/sppg/${id}/checklist`, {
            method: 'POST',
            body: JSON.stringify({
                items: items.map(i => ({
                    masterItemId: i.masterItemId,
                    isCompleted: i.isCompleted
                }))
            })
        });
        
        // Update initialItems locally to avoid warning
        setInitialItems(JSON.parse(JSON.stringify(items))); // Match current state
        
        // Navigate back immediately
        router.back();
    } catch (error: any) {
        isSavingRef.current = false; // Reset if failed
        // Replaced Alert with logging or toast (for now console, could be another modal)
        console.error('Failed to save:', error);
        // Alert.alert('Gagal', error.message || 'Gagal menyimpan data');
    } finally {
        setSaving(false);
        // Note: isSavingRef stays true if successful to prevent navigation block during exit transition
    }
  };

  const handleConfirmLeave = () => {
      setShowConfirmModal(false);
      if (pendingAction) {
          navigation.dispatch(pendingAction);
      }
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-[#F8F9FD]">
            <ActivityIndicator size="large" color="#356DF1" />
        </View>
    );
  }

  const percentage = calculateProgress();

  return (
    <View className="flex-1 bg-[#F8F9FD]">
      <StatusBar style="light" />
      
      {/* A. HEADER & INFO BANNER */}
      <View className="bg-[#356DF1] pt-12 px-5">
        <View className="flex-row items-center  mb-6">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm mr-4"
            >
                <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            
            <View>
                <Text className="text-white text-lg font-plus-jakarta-extrabold">Validasi Proses Bangun</Text>
                <Text className="text-blue-100 text-xs font-plus-jakarta-semibold">{items.length > 0 ? `SPPG-${id.toString()}` : 'Detail'}</Text> 
            </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#EFF6FF] rounded-xl p-3 flex-row items-start shadow-sm mb-4">
            <Info size={16} color="#1E3A8A" style={{ marginTop: 2, marginRight: 8 }} />
            <Text className="flex-1 text-[#1E3A8A] text-xs font-plus-jakarta-semibold leading-4">
                Checklist ini digunakan untuk memvalidasi bahwa bukti yang telah diunggah benar, lengkap, dan sesuai kondisi lapangan.
            </Text>
        </View>
         {items.map((item) => (
             <View 
                key={item.masterItemId} 
                className="bg-white p-4 rounded-[16px] mb-4 border border-gray-50"
                style={SOFT_SHADOW}
             >
                {/* Header Kartu */}
                <View className="flex-row justify-between items-start mb-4">
                    <Text className="flex-1 text-[#1F2937] text-sm font-plus-jakarta-extrabold leading-5 mr-3">
                        {item.description}
                    </Text>
                    <View className="bg-[#DBEAFE] px-2 py-1 rounded-full">
                        <Text className="text-[#2563EB] text-[10px] font-plus-jakarta-extrabold">{item.weight}%</Text>
                    </View>
                </View>

                {/* C. INTERACTIVE TOGGLE BUTTONS */}
                <View className="flex-row">
                    {/* Tombol YA */}
                    <TouchableOpacity 
                        className={`flex-1 flex-row items-center justify-center h-12 rounded-full border mr-3 ${
                            item.isCompleted === true 
                            ? 'bg-[#ECFDF5] border-[#10B981]' 
                            : 'bg-white border-gray-200'
                        }`}
                        onPress={() => toggleItem(item.masterItemId, true)}
                        activeOpacity={0.8}
                    >
                        {item.isCompleted === true ? (
                             <View className="bg-[#10B981] w-5 h-5 rounded-full items-center justify-center mr-2">
                                <Check size={12} color="white" strokeWidth={3} />
                             </View>
                        ) : (
                             <View className="border border-gray-300 w-5 h-5 rounded-full mr-2" />
                        )}
                        <Text className={`font-plus-jakarta-extrabold text-sm ${item.isCompleted === true ? 'text-[#059669]' : 'text-gray-400'}`}>
                            YA
                        </Text>
                    </TouchableOpacity>

                    {/* Tombol TIDAK */}
                    <TouchableOpacity 
                        className={`flex-1 flex-row items-center justify-center h-12 rounded-full border ${
                            item.isCompleted === false 
                            ? 'bg-[#FEF2F2] border-[#EF4444]' 
                            : 'bg-white border-gray-200'
                        }`}
                        onPress={() => toggleItem(item.masterItemId, false)}
                        activeOpacity={0.8}
                    >
                         {item.isCompleted === false ? (
                             <View className="bg-[#EF4444] w-5 h-5 rounded-full items-center justify-center mr-2">
                                <X size={12} color="white" strokeWidth={3} />
                             </View>
                        ) : (
                             <View className="border border-gray-300 w-5 h-5 rounded-full mr-2" />
                        )}
                         <Text className={`font-plus-jakarta-extrabold text-sm ${item.isCompleted === false ? 'text-[#DC2626]' : 'text-gray-400'}`}>
                            TIDAK
                        </Text>
                    </TouchableOpacity>
                </View>
             </View>
         ))}
      </ScrollView>

      {/* D. STICKY FOOTER */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white p-5 pb-8 z-20"
        style={FOOTER_SHADOW}
      >
         <View className="flex-row justify-between items-center mb-2">
             <Text className="text-gray-400 text-[10px] font-plus-jakarta-extrabold tracking-widest">HASIL VALIDASI DATA PERSIAPAN</Text>
             <Text className="text-[#356DF1] text-lg font-plus-jakarta-extrabold">{percentage}%</Text>
         </View>
         
         {/* Progress Bar */}
         <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
            <View 
                className="h-full bg-[#356DF1] rounded-full" 
                style={{ width: `${percentage}%` }} 
            />
         </View>

         {/* Main Button */}
         <TouchableOpacity 
            className="bg-[#356DF1] h-[52px] rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/30"
            onPress={handleSave}
            disabled={saving}
         >
            {saving ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    <View className="bg-white/20 p-1 rounded-md mr-2">
                        <Check size={14} color="white" strokeWidth={3} />
                    </View>
                    <Text className="text-white font-plus-jakarta-extrabold text-base">Simpan Validasi</Text>
                </>
            )}
         </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={showConfirmModal}
        title="Data Belum Disimpan"
        message="Anda memiliki perubahan yang belum disimpan. Data yang telah terisi akan hilang. Yakin ingin kembali?"
        confirmText="Ya, Kembali"
        cancelText="Batal"
        onConfirm={handleConfirmLeave}
        onCancel={() => setShowConfirmModal(false)}
        type="danger"
      />
    </View>
  );
}
