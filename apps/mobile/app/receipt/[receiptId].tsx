import { useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { getReceipt, renderReceiptImage } from "@/api/receipt";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ReceiptCard } from "@/components/ReceiptCard";
import { Screen } from "@/components/Screen";
import { colors } from "@/design/colors";
import { useHistoryStore } from "@/stores/historyStore";
import { StateView } from "@/components/StateView";

export default function ReceiptScreen() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();
  const receipt = useQuery({ queryKey: ["receipt", receiptId], queryFn: () => getReceipt(receiptId) });
  const history = useHistoryStore();
  const shotRef = useRef<ViewShot>(null);

  useEffect(() => {
    if (receipt.data) {
      void history.add({ id: receipt.data.id, title: `订单 ${receipt.data.createdAt.slice(0, 10)}`, kind: "receipt", createdAt: receipt.data.createdAt });
    }
  }, [receipt.data?.id]);

  const exportImage = async (share: boolean) => {
    try {
      const uri = await captureRef(shotRef, { format: "png", quality: 1 });
      if (share && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        return;
      }
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("需要权限", "请允许保存到相册。");
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("已保存", "订单图片已保存到相册。");
    } catch (error) {
      Alert.alert("导出失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  if (receipt.isLoading || !receipt.data) return <Screen scroll={false} bg={colors.bg2}><StateView title="加载订单" loading /></Screen>;

  return (
    <Screen bg={colors.bg2}>
      <Text style={styles.title}>出示给服务员</Text>
      <Text style={styles.sub}>订单包含原文菜名、数量、备注和你的忌口说明。</Text>
      <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
        <ReceiptCard receipt={receipt.data} />
      </ViewShot>
      <View style={styles.actions}>
        <PrimaryButton tone="accent" onPress={() => exportImage(true)}>分享订单图片</PrimaryButton>
        <View style={styles.linkRow}>
          <Pressable hitSlop={8} onPress={() => router.push(`/receipt/${receiptId}/show`)}>
            <Text style={styles.textLink}>放大出示</Text>
          </Pressable>
          <Text style={styles.dot}>·</Text>
          <Pressable hitSlop={8} onPress={() => exportImage(false)}>
            <Text style={styles.textLink}>保存到相册</Text>
          </Pressable>
          <Text style={styles.dot}>·</Text>
          <Pressable hitSlop={8} onPress={async () => {
            await renderReceiptImage(receiptId);
            await receipt.refetch();
            Alert.alert("已生成", "后端订单图片已生成到本地 data/receipts。");
          }}>
            <Text style={styles.textLink}>生成备份图</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  sub: {
    marginTop: 6,
    marginBottom: 18,
    color: colors.muted,
    lineHeight: 21
  },
  actions: {
    marginTop: 18,
    gap: 12
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  textLink: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800"
  },
  dot: {
    color: colors.muted,
    fontSize: 12
  }
});
