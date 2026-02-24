import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    rowGap: theme.units[6],
    marginTop: theme.units[6],
  },
  listContainer: {
    flex: 1,
  },
}));
