import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: theme.units[9],
    paddingHorizontal: theme.units[4],
    rowGap: theme.units[11],
  },
  topContainer: {
    rowGap: theme.units[11],
  },
  lottieView: {
    width: 294,
    height: 294,
  },
  topContent: {
    maxWidth: 294,
    rowGap: theme.units[4],
  },
  actionsContainer: {
    width: "100%",
  },
}));
