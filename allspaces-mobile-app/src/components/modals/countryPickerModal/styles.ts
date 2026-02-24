import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[6],
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    rowGap: theme.units[3],
  },
  countryItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[3],
  },
  rightContainer: {},
  countryName: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  searchInput: {
    width: "100%",
    height: 55,
    borderRadius: 100,
    paddingHorizontal: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
  },
}));
