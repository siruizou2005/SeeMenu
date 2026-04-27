import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getRoom } from "@/api/room";
import { Screen } from "@/components/Screen";
import { StateView } from "@/components/StateView";
import { colors } from "@/design/colors";

export default function RoomQrScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const room = useQuery({ queryKey: ["room", roomId], queryFn: () => getRoom(roomId) });
  if (room.isLoading || !room.data) return <Screen scroll={false}><StateView title="加载邀请卡" loading /></Screen>;
  const inviteText = `SeeMenu 房间码：${room.data.joinCode}`;
  const qrValue = `seemenu://join-room?code=${room.data.joinCode}`;
  const shareInvite = async () => {
    try {
      await Share.share({
        title: "加入 SeeMenu 点餐房间",
        message: `${inviteText}\n打开 SeeMenu，输入房间码即可加入。`
      });
    } catch (error) {
      Alert.alert("分享失败", error instanceof Error ? error.message : "请稍后重试");
    }
  };

  return (
    <Screen bg="rgba(0,0,0,0.55)">
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>邀请朋友加入</Text>
        <Text style={styles.sub}>扫码或输入房间码即可看到同一份菜单</Text>
        <View style={styles.qr}>
          <QRCode value={qrValue} size={164} backgroundColor={colors.bg} color={colors.ink} />
        </View>
        <Text style={styles.codeLabel}>ROOM CODE</Text>
        <Text style={styles.code}>{room.data.joinCode}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.light} onPress={shareInvite}><Text style={styles.lightText}>分享邀请</Text></Pressable>
          <Pressable style={styles.dark} onPress={() => router.back()}><Text style={styles.darkText}>完成</Text></Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { marginTop: "auto", marginHorizontal: -20, marginBottom: -20, padding: 24, paddingBottom: 34, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.bg, alignItems: "center" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: 18 },
  title: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 6, color: colors.muted, fontSize: 12 },
  qr: { marginTop: 24, width: 200, height: 200, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, padding: 18, alignItems: "center", justifyContent: "center" },
  codeLabel: { marginTop: 18, color: colors.muted, fontSize: 11, letterSpacing: 2 },
  code: { marginTop: 2, color: colors.ink, fontSize: 30, fontWeight: "900", letterSpacing: 6 },
  actions: { marginTop: 24, flexDirection: "row", gap: 10, alignSelf: "stretch" },
  light: { flex: 1, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg2 },
  dark: { flex: 1, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.ink },
  lightText: { color: colors.ink, fontWeight: "800" },
  darkText: { color: colors.bg, fontWeight: "800" }
});
