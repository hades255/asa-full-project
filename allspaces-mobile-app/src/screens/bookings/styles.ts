import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterList: {
    columnGap: theme.units[3],
    paddingHorizontal: theme.units[4],
    paddingTop: theme.units[6],
  },
}));
