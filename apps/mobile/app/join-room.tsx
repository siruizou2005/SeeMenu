import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { joinRoom } from "@/api/room";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { colors } from "@/design/colors";
import { useCartStore } from "@/stores/cartStore";
import { useProfileStore } from "@/stores/profileStore";

export default function JoinRoomScreen() {
  const { code: initialCode } = useLocalSearchParams<{ code?: string }>();
  const [code, setCode] = useState((initialCode ?? "").toUpperCase().slice(0, 8));
  const profile = useProfileStore();
  const cart = useCartStore();

  const submit = async () => {
    try {
      const result = await joinRoom({ joinCode: code, displayName: profile.displayName, dietaryProfile: profile.dietaryProfile });
      cart.setSession({ roomId: result.room.id, memberId: result.memberId, menuId: result.room.menuId });
      router.replace(`/room/${result.room.id}`);
    } catch (error) {
      Alert.alert("加入失败", error instanceof Error ? error.message : "请检查房间码");
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>输入房间码</Text>
      <Text style={styles.sub}>请向已经在房间的朋友要 4 位房间码。</Text>
      <View style={styles.codeRow}>
        {[0, 1, 2, 3].map((index) => <View key={index} style={[styles.codeCell, index === code.length && styles.activeCell]}><Text style={styles.codeText}>{code[index] ?? ""}</Text></View>)}
      </View>
      <TextField value={code} onChangeText={(value) => setCode(value.toUpperCase().slice(0, 8))} placeholder="也可以直接输入房间码" autoCapitalize="characters" />
      <Pressable disabled={!code.trim()} onPress={submit} style={[styles.primary, !code.trim() && styles.disabled]}>
        <Text style={styles.primaryText}>加入房间</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 72, color: colors.ink, fontSize: 28, fontWeight: "900" },
  sub: { marginTop: 8, color: colors.muted, lineHeight: 22 },
  codeRow: { marginVertical: 32, flexDirection: "row", justifyContent: "center", gap: 10 },
  codeCell: {
    width: 56,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg2,
    borderWidth: 1.5,
    borderColor: "transparent"
  },
  activeCell: { borderColor: colors.accent },
  codeText: { color: colors.ink, fontSize: 28, fontWeight: "900" },
  primary: {
    marginTop: 22,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink
  },
  disabled: { opacity: 0.45 },
  primaryText: { color: colors.bg, fontSize: 15, fontWeight: "900" }
});
