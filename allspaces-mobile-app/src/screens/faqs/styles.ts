import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[4],
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    gap: theme.units[3],
    marginHorizontal: theme.units[3],
  },
  contentContainer: {
    marginTop: theme.units[3],
    marginHorizontal: theme.units[3],
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));
