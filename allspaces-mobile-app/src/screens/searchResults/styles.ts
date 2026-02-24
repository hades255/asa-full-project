import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    marginTop: theme.units[6],
    rowGap: theme.units[6],
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterList: {
    paddingTop: theme.units[6],
  },
  filterScrollList: {
    columnGap: theme.units[3],
    paddingHorizontal: theme.units[4],
  },
  resultList: {
    flex: 1,
  },
  resultListScroll: {
    rowGap: theme.units[4],
    paddingHorizontal: theme.units[4],
    paddingBottom: theme.units[6],
  },
}));
