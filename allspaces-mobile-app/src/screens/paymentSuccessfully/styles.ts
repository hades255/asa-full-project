import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
    rowGap: theme.units[8],
  },
}));
