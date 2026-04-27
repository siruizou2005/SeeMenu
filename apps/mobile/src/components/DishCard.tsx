import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { MenuItem } from "@/types/domain";
import { colors } from "@/design/colors";
import { shadows } from "@/design/shadows";
import { spacing } from "@/design/spacing";
import { radii } from "@/design/radii";
import { fontSize, fontWeight } from "@/design/typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DishCard({
  item,
  quantity = 0,
  risks = [],
  onPress,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity?: number;
  risks?: string[];
  onPress: () => void;
  onAdd: () => void;
  onRemove?: () => void;
}) {
  const addScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const addAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  function handleAdd() {
    addScale.value = withSpring(1.25, { damping: 8, stiffness: 400 }, () => {
      addScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    onAdd();
  }

  function handleRemove() {
    onRemove?.();
  }

  return (
    <Animated.View style={[styles.root, cardAnimStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { cardScale.value = withTiming(0.98, { duration: 80 }); }}
        onPressOut={() => { cardScale.value = withSpring(1, { damping: 20, stiffness: 300 }); }}
        style={styles.inner}
      >
        <View style={styles.art}>
          <Text style={styles.artText}>{item.chineseName.slice(0, 1)}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.chineseName}</Text>
            {item.confidence !== "high" ? <Text style={styles.warn}>低置信度</Text> : null}
          </View>
          <Text style={styles.source}>{item.sourceName}</Text>
          <Text numberOfLines={2} style={styles.desc}>{item.descriptionZh}</Text>
          {risks.length > 0 ? (
            <View style={styles.riskBox}>
              <Text style={styles.risk}>{risks[0]}</Text>
            </View>
          ) : null}
          <View style={styles.bottom}>
            <Text style={styles.price}>{item.priceText ?? "价格待确认"}</Text>

            {quantity > 0 ? (
              <View style={styles.stepper}>
                <Pressable onPress={handleRemove} hitSlop={8} style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>−</Text>
                </Pressable>
                <Animated.Text style={[styles.qty, addAnimStyle]}>{quantity}</Animated.Text>
                <Pressable onPress={handleAdd} hitSlop={8} style={[styles.stepBtn, styles.stepBtnAccent]}>
                  <Text style={[styles.stepBtnText, styles.stepBtnTextAccent]}>+</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={handleAdd} hitSlop={10} style={styles.add}>
                <Text style={styles.addText}>+</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    ...shadows.sm,
  },
  inner: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.cardPad,
  },
  art: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
  },
  artText: {
    color: colors.accent,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.heavy,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm2,
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.ink,
  },
  warn: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm2,
    paddingVertical: 2,
    borderRadius: radii.xs,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  source: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.muted,
  },
  desc: {
    marginTop: spacing.sm2,
    fontSize: fontSize.sm,
    lineHeight: 17,
    color: colors.ink2,
  },
  riskBox: {
    marginTop: spacing.sm2,
    alignSelf: "flex-start",
    backgroundColor: colors.dangerSoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  risk: {
    color: colors.danger,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.heavy,
  },
  bottom: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    color: colors.ink,
  },
  add: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  addText: {
    color: colors.bg,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: 22,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm2,
    backgroundColor: colors.bg2,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  stepBtnAccent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  stepBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.ink,
    lineHeight: 20,
  },
  stepBtnTextAccent: {
    color: colors.bg,
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
    color: colors.ink,
  },
});
