import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
  },
  listScroll: {
    rowGap: theme.units[4],
    paddingBottom: theme.units[10],
  },
  wrappedView: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: theme.units[3],
  },
  separator: {
    height: 1,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
    marginTop: theme.units[4],
  },
  action: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[6],
  },
}));
