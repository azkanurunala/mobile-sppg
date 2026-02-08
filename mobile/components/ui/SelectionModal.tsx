import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SelectionModalProps {
  visible: boolean;
  items: { id: string; name: string }[];
  onSelect: (id: string) => void;
  onClose: () => void;
  title: string;
}

const SelectionModal = ({ 
  visible, 
  items, 
  onSelect, 
  onClose, 
  title 
}: SelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset search query when modal opens
  useEffect(() => {
    if (visible) setSearchQuery('');
  }, [visible]);

  if (!visible) return null;

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 bg-black/50 justify-center px-6 py-20">
            <View className="bg-white rounded-xl flex-1 overflow-hidden">
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-lg font-plus-jakarta-extrabold">{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                    {/* Search Input */}
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <Search size={20} color="#9CA3AF" className="mr-2" />
                        <TextInput 
                            className="flex-1 font-plus-jakarta-medium text-gray-900 py-2 pl-4"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                
                <ScrollView className="flex-1 px-4">
                    {filteredItems.length === 0 ? (
                        <View className="py-8 items-center">
                            <Text className="text-gray-500 text-center font-plus-jakarta-medium">Tidak ditemukan</Text>
                        </View>
                    ) : (
                        filteredItems.map(item => (
                            <TouchableOpacity 
                                key={item.id} 
                                className="py-3 border-b border-gray-100"
                                onPress={() => {
                                    onSelect(item.id);
                                    onClose();
                                }}
                            >
                                <Text className="text-gray-800 font-plus-jakarta-semibold">{item.name}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    </Modal>
  );
};

export default SelectionModal;
