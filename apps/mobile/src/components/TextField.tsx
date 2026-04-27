import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "@/design/colors";

export function TextField({ style, multiline, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      selectionColor={colors.accent}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      style={[styles.input, multiline && styles.multiline, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.bg2,
    color: colors.ink,
    fontSize: 14
  },
  multiline: {
    minHeight: 78,
    paddingTop: 12,
    paddingBottom: 12
  }
});
