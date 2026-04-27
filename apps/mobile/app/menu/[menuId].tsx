import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getMenu } from "@/api/menu";
import { createRoom, updateCart } from "@/api/room";
import { DishCard } from "@/components/DishCard";
import { MenuImageHotspots } from "@/components/MenuImageHotspots";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { shadows } from "@/design/shadows";
import { spacing } from "@/design/spacing";
import { useCartStore } from "@/stores/cartStore";
import { useProfileStore } from "@/stores/profileStore";
import { useHistoryStore } from "@/stores/historyStore";
import { getDietaryRisks } from "@/utils/dietary";
import { useEffect, useRef, useState } from "react";
import { StateView } from "@/components/StateView";
import { TextField } from "@/components/TextField";

export default function MenuScreen() {
  const { menuId } = useLocalSearchParams<{ menuId: string }>();
  const menu = useQuery({ queryKey: ["menu", menuId], queryFn: () => getMenu(menuId) });
  const cart = useCartStore();
  const profile = useProfileStore();
  const history = useHistoryStore();
  const [showDebug, setShowDebug] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");

  const prevTotal = useRef(0);
  const cartBarY = useSharedValue(80);
  const cartBarOpacity = useSharedValue(0);

  useEffect(() => {
    if (menu.data) {
      void history.add({ id: menu.data.id, title: menu.data.title ?? "未命名菜单", kind: "menu", createdAt: new Date().toISOString() });
    }
  }, [menu.data?.id]);

  const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (total > 0 && prevTotal.current === 0) {
      cartBarY.value = withSpring(0, { damping: 18, stiffness: 200 });
      cartBarOpacity.value = withTiming(1, { duration: 200 });
    } else if (total === 0 && prevTotal.current > 0) {
      cartBarY.value = withTiming(80, { duration: 150 });
      cartBarOpacity.value = withTiming(0, { duration: 150 });
    }
    prevTotal.current = total;
  }, [total]);

  const cartBarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cartBarY.value }],
    opacity: cartBarOpacity.value,
  }));

  if (menu.isLoading || !menu.data) return <Screen scroll={false}><StateView title="加载菜单" loading /></Screen>;
  const quantities = new Map(cart.items.map((item) => [item.menuItemId, item.quantity]));
  const categories = ["全部", ...Array.from(new Set(menu.data.items.map((item) => item.sectionName).filter((item): item is string => Boolean(item))))];
  const filteredItems = menu.data.items.filter((item) => {
    const matchesQuery = !query.trim() || `${item.chineseName} ${item.sourceName} ${item.descriptionZh}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = category === "全部" || item.sectionName === category;
    return matchesQuery && matchesCategory;
  });

  const startRoom = async () => {
    try {
      const result = await createRoom({
        menuId,
        hostName: profile.displayName,
        dietaryProfile: profile.dietaryProfile,
        targetOrderLanguage: "ja"
      });
      cart.setSession({ menuId, roomId: result.room.id, memberId: result.memberId });
      if (cart.items.length > 0) {
        await updateCart(result.room.id, result.memberId, cart.items);
      }
      router.push(`/room/${result.room.id}`);
    } catch (error) {
      Alert.alert("创建房间失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  return (
    <Screen>
      <Text style={styles.meta}>东京 · {menu.data.menuLanguage} 菜单</Text>
      <Text style={styles.title}>{menu.data.title ?? "识别菜单"}</Text>
      <Text style={styles.sub}>点击原图中的菜名区域，查看中文解释和忌口风险。</Text>
      <Text style={styles.debugToggle} onPress={() => setShowDebug(!showDebug)}>{showDebug ? "隐藏热区调试" : "显示热区调试"}</Text>
      <TextField value={query} onChangeText={setQuery} placeholder="搜索菜品" style={styles.search} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryStrip}>
        {categories.map((item) => (
          <Pressable key={item} onPress={() => setCategory(item)} style={[styles.categoryPill, category === item && styles.categoryPillActive]}>
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <MenuImageHotspots
        menu={menu.data}
        onPressItem={(item) => router.push({ pathname: "/dish/[itemId]", params: { itemId: item.id, menuId } })}
      />

      {menu.data.warnings.map((warning) => (
        <Text key={warning} style={styles.warning}>{warning}</Text>
      ))}
      {showDebug ? (
        <View style={styles.debugBox}>
          {menu.data.items.map((item) => (
            <Text key={item.id} style={styles.debugLine}>{item.id}: {item.bbox2d?.join(",") ?? "no bbox"} · {item.bboxConfidence}</Text>
          ))}
        </View>
      ) : null}

      <Text style={styles.section}>菜品列表</Text>
      {menu.data.items.length === 0 ? <StateView compact title="没有识别到菜品" description="可以重新拍摄，或使用 Demo 菜单继续演示。" actionLabel="重新拍摄" onAction={() => router.replace("/camera")} /> : null}
      {filteredItems.map((item) => (
        <DishCard
          key={item.id}
          item={item}
          quantity={quantities.get(item.id) ?? 0}
          risks={getDietaryRisks(item, profile.dietaryProfile)}
          onPress={() => router.push({ pathname: "/dish/[itemId]", params: { itemId: item.id, menuId } })}
          onAdd={() => {
            cart.setSession({ menuId });
            cart.addItem(item);
          }}
          onRemove={() => cart.removeItem(item.id)}
        />
      ))}

      <View style={styles.cartBarSpacer} />
      <Text style={styles.cartLink} onPress={() => router.push("/cart")}>查看我的选菜</Text>

      <Animated.View style={[styles.cartBar, cartBarAnimStyle]}>
        <View style={styles.cartIconWrap}>
          <Text style={styles.cartIcon}>袋</Text>
          {total > 0 ? <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{total}</Text></View> : null}
        </View>
        <View style={styles.cartMeta}>
          <Text style={styles.cartTitle}>已选 {total} 份</Text>
          <Text style={styles.cartSub}>可创建房间邀请朋友一起点</Text>
        </View>
        <Pressable disabled={total === 0} onPress={startRoom} style={({ pressed }) => [styles.cartAction, total === 0 && styles.cartActionDisabled, pressed && { transform: [{ scale: 0.96 }] }]}>
          <Text style={styles.cartActionText}>选好</Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    marginTop: spacing.lg,
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
  },
  sub: {
    marginTop: spacing.sm2,
    marginBottom: spacing.lg,
    color: colors.muted,
    lineHeight: 21,
  },
  warning: {
    marginTop: spacing.md2,
    color: colors.accent,
    fontSize: 12,
    lineHeight: 18,
  },
  debugToggle: {
    marginBottom: spacing.md,
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  search: { marginBottom: spacing.md },
  categoryStrip: { gap: spacing.sm, paddingBottom: spacing.lg2 },
  categoryPill: {
    paddingHorizontal: spacing.lg2,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.bg2,
  },
  categoryPillActive: { backgroundColor: colors.ink },
  categoryText: { color: colors.ink2, fontSize: 12, fontWeight: "800" },
  categoryTextActive: { color: colors.bg },
  debugBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.bg2,
  },
  debugLine: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
  },
  section: {
    marginTop: spacing.section,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
  cartBarSpacer: { height: spacing["3xl"] },
  cartLink: {
    marginBottom: spacing.sm,
    textAlign: "center",
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  cartBar: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    borderRadius: 26,
    backgroundColor: colors.ink,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.lg,
  },
  cartIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlayWhite12,
  },
  cartIcon: {
    color: colors.bg,
    fontSize: 12,
    fontWeight: "900",
  },
  cartBadge: {
    position: "absolute",
    top: -7,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  cartBadgeText: {
    color: colors.bg,
    fontSize: 9,
    fontWeight: "900",
  },
  cartMeta: { flex: 1 },
  cartTitle: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: "900",
  },
  cartSub: {
    marginTop: 2,
    color: colors.overlayWhite55,
    fontSize: 12,
  },
  cartAction: {
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  cartActionDisabled: { opacity: 0.45 },
  cartActionText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "900",
  },
});
