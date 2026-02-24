import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  imageStyle: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.units[4],
    rowGap: theme.units[1],
    alignItems: "center",
    justifyContent: "center",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: theme.units[1],
  },
  sliderDot: {
    height: 8,
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
    borderRadius: 100,
  },
}));
