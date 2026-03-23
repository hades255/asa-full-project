import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  promptContainer: {
    marginHorizontal: theme.units[4],
    marginTop: theme.units[3],
    marginBottom: theme.units[2],
    paddingVertical: theme.units[2],
    paddingHorizontal: theme.units[3],
    borderRadius: theme.units[2],
    backgroundColor:
      theme.colors.semanticExtensions.background.backgroundAccent,
  },
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
    paddingHorizontal: theme.units[4],
    paddingBottom: theme.units[6],
  },
}));
