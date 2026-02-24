import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingTop: theme.units[6],
  },
  mainScrollContainer: {
    rowGap: theme.units[6],
    paddingBottom: 100,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 124,
    height: 124,
  },
  statusContainer: {
    width: 172,
    height: 42,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: theme.units[3],
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  seperator: {
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
    height: 1,
    borderRadius: 100,
  },
}));
