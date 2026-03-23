import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    rowGap: theme.units[9],
    paddingVertical: theme.units[9],
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.units[4],
  },
  stepContainer: {
    flex: 1,
  },
}));
