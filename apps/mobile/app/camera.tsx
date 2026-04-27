import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { uploadMenuScan } from "@/api/menu";
import { useProfileStore } from "@/stores/profileStore";

export default function CameraScreen() {
  const profile = useProfileStore();
  const [loading, setLoading] = useState(false);

  const pick = async (mode: "camera" | "library") => {
    const permission = mode === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("需要权限", "请允许访问相机或相册。");
      return;
    }

    const result = mode === "camera"
      ? await ImagePicker.launchCameraAsync({ quality: 0.86 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.86, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (result.canceled) return;

    router.push({ pathname: "/photo-review", params: { uri: result.assets[0].uri } });
  };

  return (
    <Screen bg="#0A0805">
      <View style={styles.frame}>
        <View style={styles.menuPaper}>
          <Text style={styles.jpTitle}>麺処 つばき</Text>
          {["豚骨ラーメン", "醤油ラーメン", "焼き餃子", "鶏の唐揚げ", "枝豆"].map((item, index) => (
            <View key={item} style={styles.menuRow}>
              <Text style={styles.jp}>{item}</Text>
              <Text style={styles.jp}>¥{[1180, 1080, 580, 780, 380][index]}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.tip}>将菜单完整放入框内，避免反光和倾斜。</Text>
      <View style={styles.actions}>
        <View style={styles.modeRow}>
          <Text style={styles.modeText}>相册</Text>
          <Text style={styles.modeActive}>· 菜单 ·</Text>
          <Text style={styles.modeText}>扫码</Text>
        </View>
        <View style={styles.cameraControls}>
          <Pressable disabled={loading} onPress={() => pick("library")} style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}>
            <Text style={styles.sideControlText}>相册</Text>
          </Pressable>
          <Pressable disabled={loading} onPress={() => pick("camera")} style={({ pressed }) => [styles.shutter, loading && styles.disabled, pressed && !loading && styles.shutterPressed]}>
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.sideControl}>
            <Text style={styles.sideControlText}>{loading ? "识别" : "闪光"}</Text>
          </View>
        </View>
        {loading ? <Text style={styles.loadingText}>识别中…</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: {
    marginTop: 54,
    minHeight: 420,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  menuPaper: {
    width: 280,
    padding: 24,
    borderRadius: 4,
    backgroundColor: "#F0E4C8",
    transform: [{ rotate: "-2deg" }]
  },
  jpTitle: {
    marginBottom: 16,
    textAlign: "center",
    color: "#2A1A08",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  jp: {
    color: "#2A1A08",
    fontSize: 14,
    fontWeight: "700"
  },
  tip: {
    marginTop: 20,
    textAlign: "center",
    color: "rgba(255,255,255,0.72)",
    lineHeight: 20
  },
  actions: {
    marginTop: "auto",
    alignItems: "center",
    gap: 18
  },
  modeRow: {
    flexDirection: "row",
    gap: 22
  },
  modeText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11
  },
  modeActive: {
    color: colors.bg,
    fontSize: 11,
    fontWeight: "800"
  },
  cameraControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 46
  },
  sideControl: {
    width: 48,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  sideControlText: {
    color: colors.bg,
    fontSize: 11,
    fontWeight: "700"
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: colors.bg,
    padding: 5
  },
  shutterInner: {
    flex: 1,
    borderRadius: 34,
    backgroundColor: colors.bg
  },
  shutterPressed: {
    transform: [{ scale: 0.94 }]
  },
  pressed: {
    opacity: 0.72
  },
  disabled: {
    opacity: 0.5
  },
  loadingText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12
  }
});
