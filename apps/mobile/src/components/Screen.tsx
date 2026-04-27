import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "@/design/colors";

export function Screen({
  children,
  scroll = true,
  padded = true,
  bg = colors.bg
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  bg?: string;
}) {
  if (!scroll) {
    return <SafeAreaView style={[styles.root, { backgroundColor: bg }]}><View style={[styles.content, !padded && styles.noPad]}>{children}</View></SafeAreaView>;
  }
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={[styles.content, !padded && styles.noPad]}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    padding: 20
  },
  noPad: {
    padding: 0
  }
});
