import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { fontSize, fontWeight } from "@/design/typography";
import { radii } from "@/design/radii";
import { createDemoMenu } from "@/api/menu";
import { useProfileStore } from "@/stores/profileStore";
import { joinRoom } from "@/api/room";
import { useCartStore } from "@/stores/cartStore";
import { useHistoryStore } from "@/stores/historyStore";
import { TextField } from "@/components/TextField";
import { StateView } from "@/components/StateView";

export default function HomeScreen() {
  const profile = useProfileStore();
  const history = useHistoryStore();
  const cart = useCartStore();
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    void profile.hydrate();
    void history.hydrate();
  }, []);

  if (!profile.hydrated) {
    return <Screen scroll={false}><StateView title="加载中" loading /></Screen>;
  }

  const handleJoin = async () => {
    try {
      const result = await joinRoom({ joinCode, displayName: profile.displayName, dietaryProfile: profile.dietaryProfile });
      cart.setSession({ roomId: result.room.id, memberId: result.memberId, menuId: result.room.menuId });
      router.push(`/room/${result.room.id}`);
    } catch (error) {
      Alert.alert("加入失败", error instanceof Error ? error.message : "请检查房间码");
    }
  };

  const handleDemo = async () => {
    try {
      const scan = await createDemoMenu();
      if (scan.menuId) router.push(`/menu/${scan.menuId}`);
    } catch (error) {
      Alert.alert("Demo 加载失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  return (
    <Screen>
      <View style={styles.topRow}>
        <View style={styles.logo}><Text style={styles.logoText}>看</Text></View>
        <View>
          <Text style={styles.brand}>SeeMenu</Text>
          <Text style={styles.brandSub}>智拍菜单</Text>
        </View>
        <Pressable style={styles.profileBtn} onPress={() => router.push("/profile")}>
          <Avatar name={profile.displayName || "我"} size="md" variant="muted" />
        </Pressable>
      </View>

      <Text style={styles.hero}>看懂任何外文菜单。</Text>
      <Text style={styles.sub}>拍一张照，AI 帮你翻译、点单，并生成给服务员看的订单说明。</Text>

      <View style={styles.featureStack}>
        {[
          ["①", "拍照识别", "对准菜单，自动框出每道菜"],
          ["②", "原图点菜", "点击菜单原图热区看中文详情"],
          ["③", "一键出示", "生成本地语言订单给服务员"]
        ].map(([num, title, desc]) => (
          <Card key={title} variant="elevated" size="md" style={styles.featureCard}>
            <View style={styles.featureIcon}><Text style={styles.featureIconText}>{num}</Text></View>
            <View style={styles.featureBody}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDesc}>{desc}</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.mainCta}>
        <PrimaryButton onPress={() => router.push("/camera")}>拍菜单</PrimaryButton>
        <View style={styles.inlineLinks}>
          <Text style={styles.inlineMuted}>想先看效果？</Text>
          <Text style={styles.textLink} onPress={handleDemo}>加载 Demo 菜单</Text>
        </View>
      </View>

      <Card variant="elevated" size="md" style={styles.joinCard}>
        <Text style={styles.cardTitle}>已加入朋友的菜单？</Text>
        <View style={styles.joinRow}>
          <View style={styles.joinInput}>
            <TextField value={joinCode} onChangeText={(value) => setJoinCode(value.toUpperCase())} placeholder="输入房间码" autoCapitalize="characters" maxLength={8} />
          </View>
          <Pressable disabled={!joinCode.trim()} onPress={handleJoin} style={({ pressed }) => [styles.joinButton, !joinCode.trim() && styles.joinButtonDisabled, pressed && { opacity: 0.72 }]}>
            <Text style={styles.joinButtonText}>加入</Text>
          </Pressable>
        </View>
        <Text style={styles.textLink} onPress={() => router.push("/join-room")}>打开完整加入页</Text>
      </Card>

      {history.entries.length > 0 ? (
        <Card variant="elevated" size="md" style={styles.historyCard}>
          <Text style={styles.cardTitle}>最近记录</Text>
          {history.entries.slice(0, 5).map((entry) => (
            <Pressable key={entry.id} hitSlop={6} style={({ pressed }) => [styles.history, pressed && { opacity: 0.72 }]} onPress={() => router.push(entry.kind === "menu" ? `/menu/${entry.id}` : `/receipt/${entry.id}`)}>
              <Text style={styles.historyTitle}>{entry.kind === "menu" ? "菜单" : "订单"} · {entry.title}</Text>
              <Text style={styles.historyMeta}>{entry.createdAt.slice(0, 10)}</Text>
            </Pressable>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md2,
    marginTop: spacing.xxl,
  },
  profileBtn: { marginLeft: "auto" },
  logo: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  logoText: {
    color: colors.bg,
    fontWeight: fontWeight.black,
    fontSize: fontSize.xl,
  },
  brand: {
    color: colors.ink,
    fontWeight: fontWeight.heavy,
    fontSize: fontSize.xl,
  },
  brandSub: {
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  hero: {
    marginTop: spacing["3xl"],
    color: colors.ink,
    fontSize: fontSize.h1,
    lineHeight: 42,
    fontWeight: fontWeight.black,
    letterSpacing: -1,
  },
  sub: {
    marginTop: spacing.md2,
    color: colors.muted,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  featureStack: {
    marginTop: spacing["3xl"],
    gap: spacing.sm,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  featureIconText: {
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
  },
  featureBody: { flex: 1 },
  featureTitle: {
    color: colors.ink,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
  },
  featureDesc: {
    marginTop: 2,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  mainCta: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
  },
  inlineLinks: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  inlineMuted: {
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  textLink: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
  },
  joinCard: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  joinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md2,
  },
  joinInput: { flex: 1 },
  joinButton: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: radii.xxl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  joinButtonDisabled: { opacity: 0.4 },
  joinButtonText: {
    color: colors.bg,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.heavy,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
  },
  historyCard: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  history: {
    paddingVertical: spacing.md2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  historyTitle: {
    color: colors.ink,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  historyMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
