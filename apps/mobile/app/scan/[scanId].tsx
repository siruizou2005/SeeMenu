import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { getScan } from "@/api/menu";
import { createDemoMenu } from "@/api/menu";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { StateView } from "@/components/StateView";
import { colors } from "@/design/colors";

export default function ScanScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const scan = useQuery({
    queryKey: ["scan", scanId],
    queryFn: () => getScan(scanId),
    refetchInterval: (query) => query.state.data?.status === "processing" ? 1200 : false
  });

  useEffect(() => {
    if (scan.data?.status === "completed" && scan.data.menuId) {
      const timer = setTimeout(() => router.replace(`/menu/${scan.data?.menuId}`), 650);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [scan.data?.status, scan.data?.menuId]);

  return (
    <Screen>
      <View style={styles.center}>
        {scan.data?.status !== "failed" ? <StateView title="AI 识别中" description="正在识别菜品、价格、bbox 热区和忌口风险。" loading /> : null}
        {scan.data?.status === "failed" ? (
          <>
            <Text style={styles.title}>识别失败</Text>
            <Text style={styles.sub}>{scan.data.errorMessage}</Text>
            <PrimaryButton onPress={() => router.replace("/camera")}>重新拍摄</PrimaryButton>
            <Text style={styles.textLink} onPress={async () => {
              const demo = await createDemoMenu();
              if (demo.menuId) router.replace(`/menu/${demo.menuId}`);
            }}>使用样例菜单继续演示</Text>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14
  },
  title: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  sub: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22
  },
  textLink: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800"
  }
});
