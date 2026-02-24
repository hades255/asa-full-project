import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  loaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.units[4],
    rowGap: theme.units[6],
  },
  userDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userDetailsLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userDetailsContent: {
    rowGap: 2,
    flex: 1,
    paddingHorizontal: theme.units[3],
  },
  userDetailsContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.semantic.content.contentInverseSecondary,
  },
  listContainer: {
    rowGap: theme.units[3],
  },
  itemContainer: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.units[3],
    columnGap: theme.units[2],
  },
}));
