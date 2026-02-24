import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: theme.units[4],
    padding: theme.units[4],
    borderRadius: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    width: 334,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  rightContent: {
    flex: 1,
    rowGap: theme.units[1],
  },
  rightTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: theme.units[3],
  },
  rightLeftRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: theme.units[1],
  },
}));
