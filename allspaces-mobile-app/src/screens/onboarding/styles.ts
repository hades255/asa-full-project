import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    paddingVertical: theme.units[9],
  },
  topContainer: {
    alignItems: "flex-end",
  },
  middleContainer: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.units[2],
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  btnStyle: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      theme.colors.semanticExtensions.background.backgroundAccent,
  },
  btnText: {
    ...theme.typography.button1,
    color: theme.colors.semantic.content.contentPrimary,
  },
}));
