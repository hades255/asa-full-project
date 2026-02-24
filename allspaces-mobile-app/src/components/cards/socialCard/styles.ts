import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[4],
    borderRadius: theme.units[4],
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[4],
  },
  title: {
    ...theme.typography.button1,
    color: theme.colors.semantic.content.contentPrimary,
  },
}));
