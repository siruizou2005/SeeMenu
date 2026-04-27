import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/design/colors";
import { PrimaryButton } from "./PrimaryButton";

export function StateView({
  title,
  description,
  loading,
  actionLabel,
  onAction,
  compact = false
}: {
  title: string;
  description?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}) {
  return (
    <View style={[styles.root, compact && styles.compact]}>
      {loading ? <ActivityIndicator color={colors.accent} size="large" /> : <View style={styles.dot}><Text style={styles.dotText}>!</Text></View>}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? <PrimaryButton tone="light" onPress={onAction}>{actionLabel}</PrimaryButton> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24
  },
  compact: {
    flex: 0,
    minHeight: 180,
    paddingVertical: 24
  },
  dot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg2
  },
  dotText: {
    color: colors.muted,
    fontSize: 28,
    fontWeight: "900"
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center"
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  }
});
