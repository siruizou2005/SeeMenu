import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/design/colors";
import { fontWeight } from "@/design/typography";
import { radii } from "@/design/radii";

type Size = "sm" | "md" | "lg";
type Variant = "accent" | "muted" | "ink";

const sizeMap: Record<Size, { container: number; fontSize: number }> = {
  sm: { container: 28, fontSize: 13 },
  md: { container: 34, fontSize: 15 },
  lg: { container: 46, fontSize: 20 },
};

const variantBg: Record<Variant, string> = {
  accent: colors.accentSoft,
  muted: colors.bg2,
  ink: colors.ink,
};

const variantText: Record<Variant, string> = {
  accent: colors.accent,
  muted: colors.muted,
  ink: colors.bg,
};

interface AvatarProps {
  name: string;
  size?: Size;
  variant?: Variant;
}

export function Avatar({ name, size = "md", variant = "muted" }: AvatarProps) {
  const { container, fontSize } = sizeMap[size];
  return (
    <View
      style={[
        styles.container,
        { width: container, height: container, borderRadius: radii.full, backgroundColor: variantBg[variant] },
      ]}
    >
      <Text style={[styles.letter, { fontSize, color: variantText[variant] }]}>
        {name.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontWeight: fontWeight.heavy,
  },
});
