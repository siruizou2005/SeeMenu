import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { createReceipt } from "@/api/receipt";
import { getRoom, setMemberReady, updateCart } from "@/api/room";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { useCartStore } from "@/stores/cartStore";
import { StateView } from "@/components/StateView";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const cart = useCartStore();
  const room = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId),
    refetchInterval: 1800
  });

  const syncCart = async () => {
    if (!cart.memberId) return;
    await updateCart(roomId, cart.memberId, cart.items);
    await room.refetch();
  };

  const makeReceipt = async () => {
    try {
      if (cart.memberId) await syncCart();
      const receipt = await createReceipt(roomId, "ja");
      router.push(`/receipt/${receipt.id}`);
    } catch (error) {
      Alert.alert("生成失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  const markReady = async () => {
    if (!cart.memberId) return;
    await syncCart();
    await setMemberReady(roomId, cart.memberId, true);
    await room.refetch();
  };

  if (room.isLoading || !room.data) return <Screen scroll={false}><StateView title="加载房间" loading /></Screen>;

  return (
    <Screen>
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>ROOM CODE</Text>
        <Text style={styles.code}>{room.data.joinCode}</Text>
        <Text style={styles.codeHint}>朋友打开 SeeMenu 输入此码即可加入</Text>
        <Pressable style={styles.qrEntry} onPress={() => router.push(`/room/${roomId}/qr`)}>
          <Text style={styles.qrEntryText}>显示二维码</Text>
        </Pressable>
      </View>

      <View style={styles.syncRow}>
        <Text style={styles.section}>房间内 · {room.data.members.length} 人</Text>
        <Text style={styles.green}>● 自动同步中</Text>
      </View>

      {room.data.members.map((member) => (
        <View key={member.id} style={styles.member}>
          <Text style={styles.memberName}>{member.displayName}</Text>
          <Text style={styles.memberMeta}>已选 {member.cart.reduce((sum, item) => sum + item.quantity, 0)} 份 · {member.ready ? "已选好" : "未确认"}</Text>
          <Text style={styles.memberDiet}>忌口：{[
            ...member.dietaryProfile.allergies,
            member.dietaryProfile.religion,
            ...member.dietaryProfile.lifestyle,
            member.dietaryProfile.notes
          ].filter(Boolean).join("、") || "未填写"}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <View>
          <Text style={styles.total}>合计 {room.data.totalItems} 份</Text>
          <Text style={styles.totalSub}>确认后生成可出示给服务员的订单</Text>
        </View>
        <View style={styles.footerActions}>
          <Pressable onPress={syncCart} style={({ pressed }) => [styles.secondaryPill, pressed && styles.pressed]}>
            <Text style={styles.secondaryPillText}>同步</Text>
          </Pressable>
          <Pressable onPress={markReady} style={({ pressed }) => [styles.secondaryPill, pressed && styles.pressed]}>
            <Text style={styles.secondaryPillText}>我已选好</Text>
          </Pressable>
          <Pressable onPress={makeReceipt} style={({ pressed }) => [styles.primaryPill, pressed && styles.primaryPressed]}>
            <Text style={styles.primaryPillText}>生成订单</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeCard: {
    marginTop: 22,
    padding: 22,
    borderRadius: 20,
    backgroundColor: colors.ink
  },
  codeLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800"
  },
  code: {
    marginTop: 4,
    color: colors.bg,
    fontSize: 44,
    letterSpacing: 8,
    fontWeight: "900"
  },
  codeHint: {
    marginTop: 6,
    color: "rgba(255,255,255,0.7)"
  },
  qrEntry: { marginTop: 14, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)" },
  qrEntryText: { color: colors.bg, fontSize: 12, fontWeight: "800" },
  syncRow: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  section: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  green: {
    color: colors.green,
    fontSize: 12
  },
  member: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line
  },
  memberName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  memberMeta: {
    marginTop: 4,
    color: colors.muted
  },
  memberDiet: {
    marginTop: 6,
    color: colors.accent,
    fontSize: 12,
    lineHeight: 18
  },
  footer: {
    marginTop: 24,
    padding: 14,
    borderRadius: 24,
    backgroundColor: colors.bg2,
    gap: 12
  },
  total: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  totalSub: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  secondaryPill: {
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line
  },
  secondaryPillText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  primaryPill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink
  },
  primaryPillText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.72
  },
  primaryPressed: {
    transform: [{ scale: 0.97 }]
  }
});
