import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { useProfileStore } from "@/stores/profileStore";
import { useHistoryStore } from "@/stores/historyStore";

export default function ProfileScreen() {
  const profile = useProfileStore();
  const history = useHistoryStore();
  return (
    <Screen>
      <Text style={styles.title}>个人中心</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>我</Text></View>
        <View>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.meta}>已保存 {history.entries.length} 条历史</Text>
        </View>
      </View>
      <View style={styles.list}>
        <Row title="历史菜单" subtitle="查看最近识别和订单" onPress={() => router.push("/history")} />
        <Row title="设置" subtitle="语言、忌口和通用偏好" onPress={() => router.push("/settings")} />
        <Row title="重新填写忌口" subtitle="更新过敏原和饮食限制" onPress={() => profile.reset()} />
      </View>
    </Screen>
  );
}

function Row({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.row}><View><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSub}>{subtitle}</Text></View><Text style={styles.chev}>›</Text></Pressable>;
}

const styles = StyleSheet.create({
  title: { marginTop: 36, color: colors.ink, fontSize: 28, fontWeight: "900" },
  profileCard: { marginTop: 18, padding: 16, borderRadius: 20, backgroundColor: colors.bg2, flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  avatarText: { color: colors.bg, fontWeight: "900" },
  name: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  meta: { marginTop: 3, color: colors.muted, fontSize: 12 },
  list: { marginTop: 18 },
  row: { paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  rowSub: { marginTop: 3, color: colors.muted, fontSize: 12 },
  chev: { color: colors.muted2, fontSize: 24 }
});
