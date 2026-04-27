import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { uploadMenuScan } from "@/api/menu";
import { colors } from "@/design/colors";
import { useProfileStore } from "@/stores/profileStore";

export default function PhotoReviewScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const profile = useProfileStore();
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    if (!uri) return;
    setLoading(true);
    try {
      const scan = await uploadMenuScan({
        uri,
        dietaryProfile: profile.dietaryProfile,
        targetLanguage: "zh-CN",
        countryCode: "JP"
      });
      router.replace(`/scan/${scan.scanId}`);
    } catch (error) {
      Alert.alert("上传失败", error instanceof Error ? error.message : "请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {uri ? <Image source={{ uri }} resizeMode="contain" style={styles.image} /> : null}
      <View style={styles.topBar}>
        <Pressable style={styles.circle} onPress={() => router.back()}><Text style={styles.circleText}>‹</Text></Pressable>
        <Text style={styles.navTitle}>预览</Text>
        <Pressable style={styles.circle} onPress={() => router.back()}><Text style={styles.smallText}>重拍</Text></Pressable>
      </View>
      <View style={styles.tip}><Text style={styles.tipText}>✓ 已拍清晰</Text></View>
      <View style={styles.footer}>
        <Text style={styles.footerHint}>确认无误后开始 AI 识别（约需 5-10 秒）</Text>
        <View style={styles.actions}>
          <Pressable style={styles.secondary} onPress={() => router.back()}><Text style={styles.secondaryText}>重拍</Text></Pressable>
          <Pressable disabled={loading} style={[styles.primary, loading && styles.disabled]} onPress={startScan}>
            <Text style={styles.primaryText}>{loading ? "上传中…" : "开始识别"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0805" },
  image: { ...StyleSheet.absoluteFillObject },
  topBar: {
    position: "absolute",
    top: 54,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.42)"
  },
  circleText: { color: colors.bg, fontSize: 28, marginTop: -2 },
  smallText: { color: colors.bg, fontSize: 11, fontWeight: "700" },
  navTitle: { color: colors.bg, fontSize: 15, fontWeight: "800" },
  tip: {
    position: "absolute",
    top: 112,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)"
  },
  tipText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: "rgba(0,0,0,0.82)",
    gap: 10
  },
  footerHint: { color: "rgba(255,255,255,0.62)", textAlign: "center", fontSize: 11 },
  actions: { flexDirection: "row", gap: 10 },
  secondary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)"
  },
  primary: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  disabled: { opacity: 0.55 },
  secondaryText: { color: colors.bg, fontWeight: "800" },
  primaryText: { color: colors.bg, fontWeight: "900" }
});
