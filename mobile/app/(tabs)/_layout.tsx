import { Tabs } from 'expo-router';
import C from '../../src/theme';
import Ico from '../../src/components/Icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: C.accent,
      tabBarInactiveTintColor: C.muted,
      tabBarStyle: { borderTopColor: C.line, borderTopWidth: 0.5 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
    }}>
      <Tabs.Screen name="index" options={{ title: '首页', tabBarIcon: ({ color, size }) => Ico.camera(color, size) }} />
      <Tabs.Screen name="history" options={{ title: '历史', tabBarIcon: ({ color, size }) => Ico.clock(color, size) }} />
      <Tabs.Screen name="profile" options={{ title: '我的', tabBarIcon: ({ color, size }) => Ico.heart(color, size) }} />
    </Tabs>
  );
}
