import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/design/colors";

export function Chip({
  label,
  selected,
  onPress
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={({ pressed }) => [styles.root, selected && styles.selected, pressed && styles.pressed]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.bg
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink
  },
  pressed: {
    opacity: 0.72
  },
  text: {
    color: colors.ink2,
    fontSize: 12,
    fontWeight: "600"
  },
  selectedText: {
    color: colors.bg
  }
});
