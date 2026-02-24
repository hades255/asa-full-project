import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  bodyContainer: {
    width: theme.mobileWidth,
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.units[11],
  },
  lottieContainer: {
    width: 294,
    height: 294,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.units[4],
    maxWidth: 294,
  },
}));
