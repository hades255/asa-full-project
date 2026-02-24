import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    rowGap: theme.units[2],
  },
  mainContainer: {
    flexDirection: "row",
    columnGap: theme.units[3],
  },
  checkbox: {
    borderRadius: theme.units[1],
    borderWidth: 1,
    width: 20,
    height: 20,
  },
  errorContainer: {
    paddingLeft: theme.units[4],
  },
}));
