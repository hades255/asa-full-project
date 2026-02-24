import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
    rowGap: theme.units[6],
  },
  ratingContainer: {
    alignItems: "flex-start",
    rowGap: theme.units[4],
  },
}));
