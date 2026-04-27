import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider, useApp } from '../src/context/AppContext';
import C from '../src/theme';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useApp();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace('/login');
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator color={C.accent} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
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
      </AuthGate>
    </AppProvider>
  );
}
