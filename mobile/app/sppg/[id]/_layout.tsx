
import { Stack } from 'expo-router';

export default function DetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checklist" />
      <Stack.Screen name="investor" />
    </Stack>
  );
}
