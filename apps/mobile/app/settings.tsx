import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { Chip } from "@/components/Chip";
import { colors } from "@/design/colors";
import { useProfileStore } from "@/stores/profileStore";

export default function SettingsScreen() {
  const profile = useProfileStore();
  return (
    <Screen>
      <Text style={styles.title}>设置</Text>
      <View style={styles.section}>
        <Text style={styles.label}>默认语言</Text>
        <View style={styles.chips}><Chip label="中文" selected /><Chip label="日文订单" selected /></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>忌口资料</Text>
        <Text style={styles.text}>过敏：{profile.dietaryProfile.allergies.join("、") || "未填写"}</Text>
        <Text style={styles.text}>宗教/规则：{profile.dietaryProfile.religion || "未填写"}</Text>
        <Text style={styles.text}>生活方式：{profile.dietaryProfile.lifestyle.join("、") || "未填写"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>安全提示</Text>
        <Text style={styles.text}>过敏原和忌口风险由 AI 推断，点餐前请让服务员确认。</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 36, color: colors.ink, fontSize: 28, fontWeight: "900" },
  section: { marginTop: 22, padding: 16, borderRadius: 18, backgroundColor: colors.bg2, gap: 8 },
  label: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  text: { color: colors.ink2, fontSize: 13, lineHeight: 20 },
  chips: { flexDirection: "row", gap: 8, flexWrap: "wrap" }
});
