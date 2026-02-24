import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[3],
  },
  chipContainer: {
    padding: theme.units[3],
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: theme.units[2],
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[2],
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.units[2],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.core.accent,
  },
  wrapContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    rowGap: theme.units[3],
    columnGap: theme.units[3],
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
}));
