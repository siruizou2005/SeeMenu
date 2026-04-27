import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { colors } from "@/design/colors";
import { shadows } from "@/design/shadows";
import { radii } from "@/design/radii";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  children,
  onPress,
  tone = "dark",
  disabled = false
}: {
  children: ReactNode;
  onPress?: () => void;
  tone?: "dark" | "accent" | "light";
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 20, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 20, stiffness: 300 }); }}
      style={[
        styles.button,
        tone === "accent" && styles.accent,
        tone === "light" && styles.light,
        tone === "accent" ? shadows.accent : shadows.md,
        disabled && styles.disabled,
        animStyle,
      ]}
    >
      <Text style={[styles.text, tone === "light" && styles.lightText]}>{children}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radii.xxl,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.ink,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  light: {
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: "700",
  },
  lightText: {
    color: colors.ink,
  },
});
