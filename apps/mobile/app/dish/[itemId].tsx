import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getMenu } from "@/api/menu";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { fontSize, fontWeight } from "@/design/typography";
import { radii } from "@/design/radii";
import { useCartStore } from "@/stores/cartStore";
import { useProfileStore } from "@/stores/profileStore";
import { getDietaryRisks } from "@/utils/dietary";
import { TextField } from "@/components/TextField";
import { StateView } from "@/components/StateView";

const quickNotes = ["不要葱", "不要香菜", "少盐", "少辣", "请确认不含过敏原"];

export default function DishScreen() {
  const { itemId, menuId } = useLocalSearchParams<{ itemId: string; menuId: string }>();
  const menu = useQuery({ queryKey: ["menu", menuId], queryFn: () => getMenu(menuId) });
  const cart = useCartStore();
  const profile = useProfileStore();
  const [note, setNote] = useState("");

  if (menu.isLoading || !menu.data) return <Screen scroll={false}><StateView title="加载菜品" loading /></Screen>;
  const item = menu.data.items.find((candidate) => candidate.id === itemId);
  if (!item) return <Screen scroll={false}><StateView title="菜品不存在" description="这道菜可能已被修正或删除。" actionLabel="返回" onAction={() => router.back()} /></Screen>;
  const risks = getDietaryRisks(item, profile.dietaryProfile);

  return (
    <Screen>
      <LinearGradient
        colors={[colors.accentSoft, colors.bg]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroText}>{item.chineseName.slice(0, 1)}</Text>
      </LinearGradient>

      <Text style={styles.title}>{item.chineseName}</Text>
      <Text style={styles.source}>{item.sourceName}</Text>
      <Text style={styles.price}>{item.priceText ?? "价格待确认"}</Text>
      <Text style={styles.desc}>{item.descriptionZh}</Text>

      {risks.length > 0 ? (
        <View style={styles.riskBox}>
          <Text style={styles.riskTitle}>与你的忌口有关</Text>
          {risks.map((risk) => <Text key={risk} style={styles.riskText}>{risk}</Text>)}
        </View>
      ) : null}

      <Text style={styles.label}>主要食材推断</Text>
      <View style={styles.chips}>{item.ingredientsGuess.map((value) => <Chip key={value} label={value} />)}</View>

      <Text style={styles.label}>过敏原与风险</Text>
      <View style={styles.chips}>{[...item.allergensGuess, ...item.dietaryFlags].map((value) => <Chip key={value} label={value} />)}</View>
      <Text style={styles.warning}>这些信息由 AI 推断，请向服务员确认。</Text>

      <Text style={styles.label}>忌口备注</Text>
      <View style={styles.chips}>
        {quickNotes.map((value) => <Chip key={value} label={value} selected={note.includes(value)} onPress={() => setNote(note ? `${note}；${value}` : value)} />)}
      </View>
      <TextField value={note} onChangeText={setNote} placeholder="例如：不要葱，对花生过敏" multiline style={styles.noteInput} />

      <PrimaryButton tone="accent" onPress={() => {
        cart.setSession({ menuId });
        cart.addItem(item, note.trim());
        router.back();
      }}>加入订单</PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.xl,
    height: 220,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    color: colors.accent,
    fontSize: fontSize.jumbo,
    fontWeight: fontWeight.black,
    opacity: 0.6,
  },
  title: {
    marginTop: spacing.xl,
    color: colors.ink,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.black,
  },
  source: {
    marginTop: 4,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  price: {
    marginTop: spacing.md,
    color: colors.ink,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.black,
  },
  desc: {
    marginTop: spacing.md,
    color: colors.ink2,
    fontSize: fontSize.lg,
    lineHeight: 24,
  },
  label: {
    marginTop: spacing.xl2,
    marginBottom: spacing.sm,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  warning: {
    marginTop: spacing.md2,
    color: colors.accent,
    fontSize: fontSize.sm,
  },
  riskBox: {
    marginTop: spacing.lg,
    padding: spacing.lg2,
    borderRadius: radii.md,
    backgroundColor: colors.dangerSoft,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  riskTitle: {
    color: colors.danger,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
  },
  riskText: {
    marginTop: spacing.sm2,
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  noteInput: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
