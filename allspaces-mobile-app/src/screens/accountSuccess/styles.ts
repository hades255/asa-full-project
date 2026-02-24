import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    rowGap: theme.units[11],
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
  },
  contentContainer: {
    maxWidth: 294,
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.units[4],
  },
  buttonsContainer: {
    width: "100%",
  },
}));
