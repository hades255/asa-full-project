import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.units[3],
  },
  sliderBg: {
    height: 6,
    flex: 1,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
  },
  sliderPercentage: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: 6,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.background.backgroundInversePrimary,
  },
}));
