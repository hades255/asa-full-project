import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imgContainer: {
    width: 64,
    height: 64,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  imgStyle: {
    width: 64,
    height: 64,
    borderRadius: 64,
  },
  leftContent: {
    flex: 1,
    paddingHorizontal: theme.units[3],
  },
  leftAlignRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[1],
  },
}));
