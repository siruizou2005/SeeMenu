import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/design/colors";
import type { Receipt } from "@/types/domain";

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>SeeMenu ORDER</Text>
      <Text style={styles.title}>请向服务员出示</Text>
      <View style={styles.dash} />
      <View style={styles.confirmBox}>
        <Text style={styles.confirmTitle}>请确认</Text>
        <Text style={styles.confirmText}>如果以下内容可以下单，请告诉我 OK。若有过敏或忌口风险，请指出。</Text>
      </View>
      <View style={styles.dash} />
      <Text style={styles.section}>当地语言订单</Text>
      <Text style={styles.target}>{receipt.targetLanguageText}</Text>
      <View style={styles.dash} />
      <Text style={styles.section}>中文核对</Text>
      <Text style={styles.zh}>{receipt.chineseText}</Text>
      <View style={styles.noteBox}>
        <Text style={styles.note}>{receipt.safetyNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: 20,
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  kicker: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700"
  },
  title: {
    marginTop: 8,
    textAlign: "center",
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800"
  },
  dash: {
    marginVertical: 18,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.line
  },
  section: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  target: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700"
  },
  zh: {
    color: colors.ink2,
    fontSize: 14,
    lineHeight: 22
  },
  noteBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accentSoft
  },
  note: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  confirmBox: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.ink
  },
  confirmTitle: {
    color: colors.bg,
    fontSize: 18,
    fontWeight: "900"
  },
  confirmText: {
    marginTop: 6,
    color: colors.overlayWhite76,
    fontSize: 13,
    lineHeight: 20
  }
});
