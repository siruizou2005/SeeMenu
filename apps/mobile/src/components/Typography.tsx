import { Text, type TextProps } from "react-native";
import { colors } from "@/design/colors";
import { fontSize, fontWeight } from "@/design/typography";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "sectionTitle"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "badge";

const variantStyles: Record<Variant, object> = {
  h1: { fontSize: fontSize.h1, fontWeight: fontWeight.black, lineHeight: 40, color: colors.ink },
  h2: { fontSize: fontSize.h2, fontWeight: fontWeight.black, lineHeight: 34, color: colors.ink },
  h3: { fontSize: fontSize.h3, fontWeight: fontWeight.black, lineHeight: 28, color: colors.ink },
  sectionTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.heavy, lineHeight: 22, color: colors.ink },
  bodyLarge: { fontSize: fontSize.xl, fontWeight: fontWeight.regular, lineHeight: 24, color: colors.ink },
  body: { fontSize: fontSize.lg, fontWeight: fontWeight.regular, lineHeight: 22, color: colors.ink },
  bodySmall: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 20, color: colors.ink2 },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, lineHeight: 17, color: colors.muted },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.heavy, lineHeight: 16, color: colors.ink },
  badge: { fontSize: fontSize.xs, fontWeight: fontWeight.heavy, lineHeight: 14, color: colors.muted },
};

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export function Typography({ variant = "body", color, style, ...props }: TypographyProps) {
  return (
    <Text
      style={[variantStyles[variant], color ? { color } : undefined, style]}
      {...props}
    />
  );
}
