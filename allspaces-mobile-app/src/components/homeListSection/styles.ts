import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[3],
    marginBottom: theme.units[6],
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.units[4],
  },
  listContainer: {
    minHeight: 296,
  },
  contentContainerStyle: {
    paddingBottom: theme.units[4],
    paddingLeft: theme.units[4],
    paddingRight: theme.units[4],
  },
}));
