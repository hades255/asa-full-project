import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    height: 55,
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: theme.units[3],
  },
  smallButton: {
    height: 36,
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: theme.units[3],
  },
}));
