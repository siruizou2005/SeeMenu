import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { getMenu } from "@/api/menu";
import { createRoom, updateCart } from "@/api/room";
import { Screen } from "@/components/Screen";
import { StateView } from "@/components/StateView";
import { Avatar } from "@/components/Avatar";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { fontSize, fontWeight } from "@/design/typography";
import { radii } from "@/design/radii";
import { shadows } from "@/design/shadows";
import { useCartStore } from "@/stores/cartStore";
import { useProfileStore } from "@/stores/profileStore";

function QtyButton({ label, onPress, accent }: { label: string; onPress: () => void; accent?: boolean }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.82, { damping: 10, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        style={[styles.qtyBtn, accent && styles.qtyBtnAccent]}
      >
        <Text style={[styles.qtyBtnText, accent && styles.qtyBtnTextAccent]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function QtyDisplay({ qty }: { qty: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function bounce() {
    scale.value = withSpring(1.4, { damping: 6, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 14, stiffness: 300 });
    });
  }

  return (
    <Animated.Text style={[styles.qty, animStyle]} onLayout={bounce}>
      {qty}
    </Animated.Text>
  );
}

export default function CartScreen() {
  const cart = useCartStore();
  const profile = useProfileStore();
  const menu = useQuery({ queryKey: ["menu", cart.menuId], queryFn: () => getMenu(cart.menuId ?? ""), enabled: Boolean(cart.menuId) });

  if (!cart.menuId) return <Screen scroll={false}><StateView title="还没有选菜" description="先拍一张菜单，选择你想点的菜。" actionLabel="去拍菜单" onAction={() => router.replace("/camera")} /></Screen>;
  if (menu.isLoading || !menu.data) return <Screen scroll={false}><StateView title="加载选菜" loading /></Screen>;

  const createOrderRoom = async () => {
    try {
      const result = await createRoom({ menuId: cart.menuId!, hostName: profile.displayName, dietaryProfile: profile.dietaryProfile, targetOrderLanguage: "ja" });
      cart.setSession({ roomId: result.room.id, memberId: result.memberId });
      await updateCart(result.room.id, result.memberId, cart.items);
      router.push(`/room/${result.room.id}`);
    } catch (error) {
      Alert.alert("创建房间失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Screen>
      <Text style={styles.title}>我的选菜</Text>
      <Text style={styles.sub}>{cart.items.length} 道 · {totalQty} 份</Text>

      {cart.items.map((line) => {
        const item = menu.data.items.find((candidate) => candidate.id === line.menuItemId);
        if (!item) return null;
        return (
          <View key={line.menuItemId} style={styles.line}>
            <Avatar name={item.chineseName} size="lg" variant="accent" />
            <View style={styles.lineBody}>
              <Text style={styles.name}>{item.chineseName}</Text>
              <Text style={styles.source}>{item.sourceName}</Text>
              {line.noteZh ? (
                <Text style={styles.note}>备注：{line.noteZh}</Text>
              ) : (
                <Text style={styles.addNote}>+ 添加备注</Text>
              )}
              <View style={styles.qtyRow}>
                <QtyButton label="−" onPress={() => cart.removeItem(item.id)} />
                <QtyDisplay qty={line.quantity} />
                <QtyButton label="+" onPress={() => cart.addItem(item, line.noteZh)} accent />
              </View>
            </View>
            <Text style={styles.price}>{item.priceText ?? ""}</Text>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.total}>合计 {totalQty} 份</Text>
        <Pressable
          disabled={cart.items.length === 0}
          style={({ pressed }) => [styles.primary, cart.items.length === 0 && styles.disabled, pressed && { opacity: 0.85 }]}
          onPress={createOrderRoom}
        >
          <Text style={styles.primaryText}>确认 · 出示给店员</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing["3xl"],
    color: colors.ink,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.black,
  },
  sub: {
    marginTop: 4,
    marginBottom: spacing.md,
    color: colors.muted,
  },
  line: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.lg2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: "flex-start",
  },
  lineBody: { flex: 1 },
  name: {
    color: colors.ink,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
  },
  source: {
    marginTop: 2,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  note: {
    marginTop: spacing.sm2,
    color: colors.accent,
    fontSize: fontSize.xs,
    backgroundColor: colors.accentSoft,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  addNote: {
    marginTop: spacing.sm2,
    color: colors.muted,
    fontSize: fontSize.xs,
    textDecorationLine: "underline",
  },
  qtyRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  qtyBtnAccent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  qtyBtnText: {
    color: colors.ink,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
    lineHeight: 20,
  },
  qtyBtnTextAccent: {
    color: colors.bg,
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: fontWeight.black,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  price: {
    color: colors.ink,
    fontWeight: fontWeight.black,
    fontSize: fontSize.md,
  },
  footer: {
    marginTop: spacing.section,
    gap: spacing.md,
    ...shadows.md,
  },
  total: {
    color: colors.ink,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.black,
  },
  primary: {
    height: 52,
    borderRadius: radii.xxl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    ...shadows.md,
  },
  disabled: { opacity: 0.45 },
  primaryText: {
    color: colors.bg,
    fontWeight: fontWeight.black,
    fontSize: fontSize.lg,
  },
});
