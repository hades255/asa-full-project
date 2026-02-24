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
  logoContainer: {
    width: 294,
    height: 294,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseAnimation: {
    width: 294,
    height: 294,
    position: "absolute",
  },
  topContainer: {
    rowGap: theme.units[11],
  },
  topContent: {
    maxWidth: 294,
    rowGap: theme.units[4],
  },
  actionsContainer: {
    width: "100%",
  },
}));
