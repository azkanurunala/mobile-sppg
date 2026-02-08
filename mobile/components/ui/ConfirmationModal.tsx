import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'danger' | 'success' | 'info';
  loading?: boolean;
}

const { width } = Dimensions.get('window');

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  type = 'danger',
  loading = false
}: ConfirmationModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-4">
          <CheckCircle2 size={24} color="#10B981" />
        </View>;
      case 'info':
        return <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-4">
          <AlertCircle size={24} color="#3B82F6" />
        </View>;
      default:
        return <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-4">
          <AlertCircle size={24} color="#EF4444" />
        </View>;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'info': return 'bg-blue-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white w-full max-w-[340px] rounded-3xl p-6 items-center shadow-xl">
          {getIcon()}
          
          <Text className="text-xl font-bold font-plus-jakarta-extrabold text-gray-900 text-center mb-2">
            {title}
          </Text>
          
          <Text className="text-sm font-plus-jakarta-medium text-gray-500 text-center mb-8 leading-5">
            {message}
          </Text>

          <View className="flex-row w-full space-x-3">
            {onCancel && (
              <TouchableOpacity 
                className="mx-2 flex-1 py-3.5 rounded-xl bg-gray-100 items-center justify-center active:bg-gray-200"
                onPress={onCancel}
                disabled={loading}
              >
                <Text className="text-gray-600 font-bold font-plus-jakarta-bold text-sm ">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              className={`mx-2 flex-1 py-3.5 rounded-xl items-center justify-center active:opacity-90 ${getConfirmButtonStyle()}`}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text className="text-white font-bold font-plus-jakarta-bold text-sm ">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
