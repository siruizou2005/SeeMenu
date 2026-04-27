import { Tabs } from 'expo-router';
import C from '../../src/theme';
import Ico from '../../src/components/Icons';
import { useApp } from '../../src/context/AppContext';
import { t } from '../../src/i18n';

export default function TabLayout() {
  const { uiLang } = useApp();
  const s = t(uiLang);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: C.accent,
      tabBarInactiveTintColor: C.muted,
      tabBarStyle: { borderTopColor: C.line, borderTopWidth: 0.5 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
    }}>
      <Tabs.Screen name="index"   options={{ title: s.tabHome,    tabBarIcon: ({ color, size }) => Ico.camera(color, size) }} />
      <Tabs.Screen name="history" options={{ title: s.tabHistory, tabBarIcon: ({ color, size }) => Ico.clock(color, size) }} />
      <Tabs.Screen name="profile" options={{ title: s.tabProfile, tabBarIcon: ({ color, size }) => Ico.heart(color, size) }} />
    </Tabs>
  );
}
