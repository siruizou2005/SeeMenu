import { View, StyleSheet, type ViewProps } from "react-native";
import { colors } from "@/design/colors";
import { radii } from "@/design/radii";
import { shadows } from "@/design/shadows";
import { spacing } from "@/design/spacing";

type Variant = "default" | "elevated" | "dark";
type Size = "sm" | "md" | "lg";

interface CardProps extends ViewProps {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, object> = {
  default: {
    backgroundColor: colors.bg2,
    ...shadows.sm,
  },
  elevated: {
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    ...shadows.md,
  },
  dark: {
    backgroundColor: colors.ink,
    ...shadows.md,
  },
};

const sizeStyles: Record<Size, object> = {
  sm: { padding: spacing.md },
  md: { padding: spacing.cardPad },
  lg: { padding: spacing.xl },
};

export function Card({ variant = "default", size = "md", style, ...props }: CardProps) {
  return (
    <View
      style={[styles.base, variantStyles[variant], sizeStyles[size], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
  },
});
