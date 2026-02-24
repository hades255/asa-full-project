import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
    rowGap: theme.units[6],
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
    borderRadius: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[4],
  },
}));
