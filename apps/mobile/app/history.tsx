import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { StateView } from "@/components/StateView";
import { colors } from "@/design/colors";
import { useHistoryStore } from "@/stores/historyStore";

export default function HistoryScreen() {
  const history = useHistoryStore();
  if (history.entries.length === 0) return <Screen scroll={false}><StateView title="暂无历史菜单" description="拍摄菜单后会自动保存到这里。" actionLabel="去拍菜单" onAction={() => router.replace("/camera")} /></Screen>;
  return (
    <Screen>
      <Text style={styles.title}>历史菜单</Text>
      <Text style={styles.clear} onPress={() => history.clear()}>清空历史</Text>
      {history.entries.map((entry) => (
        <Pressable key={entry.id} style={styles.row} onPress={() => router.push(entry.kind === "menu" ? `/menu/${entry.id}` : `/receipt/${entry.id}`)}>
          <Text style={styles.kind}>{entry.kind === "menu" ? "MENU" : "ORDER"}</Text>
          <Text style={styles.name}>{entry.title}</Text>
          <Text style={styles.date}>{entry.createdAt.slice(0, 10)}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 36, color: colors.ink, fontSize: 28, fontWeight: "900" },
  clear: { marginTop: 8, color: colors.accent, fontSize: 12, fontWeight: "800" },
  row: { marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: colors.bg2 },
  kind: { color: colors.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  name: { marginTop: 6, color: colors.ink, fontSize: 16, fontWeight: "900" },
  date: { marginTop: 4, color: colors.muted, fontSize: 12 }
});
