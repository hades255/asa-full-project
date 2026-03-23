import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
    alignItems: "center",
  },
}));
