import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
  },
  mainScrollContainer: {},
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
  },
}));
