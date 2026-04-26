import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="capture" />
        <Stack.Screen name="photo-review" />
        <Stack.Screen name="recognizing" />
        <Stack.Screen name="recognize-fail" />
        <Stack.Screen name="menu/index" />
        <Stack.Screen name="menu/[id]" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="order" />
        <Stack.Screen name="order-show" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="room" />
        <Stack.Screen name="room-qr" options={{ presentation: 'modal' }} />
        <Stack.Screen name="join-room" />
        <Stack.Screen name="settings" />
      </Stack>
    </AppProvider>
  );
}
