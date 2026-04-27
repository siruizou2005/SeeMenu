import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getReceipt } from "@/api/receipt";
import { ReceiptCard } from "@/components/ReceiptCard";
import { StateView } from "@/components/StateView";
import { colors } from "@/design/colors";

export default function ReceiptShowScreen() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();
  const receipt = useQuery({ queryKey: ["receipt", receiptId], queryFn: () => getReceipt(receiptId) });
  if (receipt.isLoading || !receipt.data) return <View style={styles.root}><StateView title="加载订单" loading /></View>;

  return (
    <View style={styles.root}>
      <View style={styles.chrome}>
        <Pressable style={styles.circle} onPress={() => router.back()}><Text style={styles.close}>×</Text></Pressable>
        <Text style={styles.hint}>请把屏幕给店员看</Text>
        <View style={styles.circle}><Text style={styles.close}>↻</Text></View>
      </View>
      <View style={styles.cardWrap}><ReceiptCard receipt={receipt.data} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, padding: 16, paddingTop: 58 },
  chrome: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  circle: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" },
  close: { color: colors.bg, fontSize: 18, fontWeight: "800" },
  hint: { color: "rgba(255,255,255,0.55)", fontSize: 12 },
  cardWrap: { flex: 1, justifyContent: "center" }
});
