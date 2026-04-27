import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { assetUrl } from "@/api/client";
import { colors } from "@/design/colors";
import type { Menu, MenuItem } from "@/types/domain";

export function MenuImageHotspots({
  menu,
  activeItemId,
  onPressItem
}: {
  menu: Menu;
  activeItemId?: string;
  onPressItem: (item: MenuItem) => void;
}) {
  const containerWidth = 320;
  const containerHeight = 420;
  const scale = Math.min(containerWidth / menu.imageWidth, containerHeight / menu.imageHeight);
  const renderWidth = menu.imageWidth * scale;
  const renderHeight = menu.imageHeight * scale;
  const offsetX = (containerWidth - renderWidth) / 2;
  const offsetY = (containerHeight - renderHeight) / 2;

  return (
    <View style={[styles.root, { width: containerWidth, height: containerHeight }]}>
      <Image source={{ uri: assetUrl(menu.imageUrl) }} resizeMode="contain" style={StyleSheet.absoluteFill} />
      {menu.items.map((item) => {
        if (!item.bbox2d || item.bboxConfidence === "low") return null;
        const [yMin, xMin, yMax, xMax] = item.bbox2d;
        const left = offsetX + (xMin / 1000) * renderWidth;
        const top = offsetY + (yMin / 1000) * renderHeight;
        // Keep min touch size modest so dense menu rows (sample + real OCR) do not overlap;
        // large mins made adjacent full-width strips stack and steal presses.
        const width = Math.max(24, ((xMax - xMin) / 1000) * renderWidth);
        const height = Math.max(12, ((yMax - yMin) / 1000) * renderHeight);
        const active = item.id === activeItemId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onPressItem(item)}
            style={[styles.hotspot, { left, top, width, height }, active && styles.activeHotspot]}
          >
            {active ? <Text style={styles.hotspotText}>{item.chineseName}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: colors.bg2
  },
  hotspot: {
    position: "absolute",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.accentHotspotBorder,
    backgroundColor: colors.accentHotspot,
  },
  activeHotspot: {
    backgroundColor: colors.accentHotspotActive,
  },
  hotspotText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    padding: 3
  }
});
