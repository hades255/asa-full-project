import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[9],
    paddingVertical: theme.units[9],
    paddingHorizontal: theme.units[4],
  },
  otpContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: theme.units[4],
  },
}));
