import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.units[9],
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textAlignCenter: {
    textAlign: "center",
  },
}));
