import { Tabs } from 'expo-router';
import { Home, FileText, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sppg"
        options={{
          title: 'SPPG',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center`}>
                <FileText size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
