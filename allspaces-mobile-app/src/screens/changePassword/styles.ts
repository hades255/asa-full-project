import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexGrow: 1,
    rowGap: theme.units[6],
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
  },
}));
