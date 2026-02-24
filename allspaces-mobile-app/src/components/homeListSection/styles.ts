import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[3],
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.units[4],
  },
  listScroll: {
    paddingHorizontal: theme.units[4],
    columnGap: theme.units[4],
    paddingBottom: theme.units[6],
  },
}));
