import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
  },
  mainScrollContainer: {
    paddingVertical: theme.units[6],
  },
  listHeader: {
    rowGap: theme.units[6],
    marginBottom: theme.units[6],
  },
  welcomeContainer: {
    rowGap: theme.units[3],
    marginHorizontal: theme.units[4],
  },
  noteContainer: {
    marginHorizontal: theme.units[4],
    borderRadius: theme.units[2],
    padding: theme.units[2],
    backgroundColor:
      theme.colors.semanticExtensions.background.backgroundAccent,
  },
  searchButton: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    borderRadius: 100,
    height: 55,
    paddingHorizontal: theme.units[4],
    columnGap: theme.units[4],
    flexDirection: "row",
    alignItems: "center",
  },
}));
