import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { Platform, View, StyleSheet } from "react-native";
import { colors } from "@/design/colors";

const queryClient = new QueryClient();

export default function Layout() {
  const content = (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webOuter}>
        <View style={styles.phoneFrame}>{content}</View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.webFrame,
    minHeight: "100vh" as any,
  },
  phoneFrame: {
    width: 390,
    height: 844,
    overflow: "hidden",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    backgroundColor: "#fff",
  },
});
