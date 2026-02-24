import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  bodyContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    rowGap: theme.units[9],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.units[4],
  },
}));
