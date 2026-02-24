import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  itemContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
    borderRadius: theme.units[4],
    rowGap: theme.units[1],
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.units[2],
  },
}));
