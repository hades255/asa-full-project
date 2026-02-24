import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[2],
  },
  labelContainer: {
    paddingLeft: theme.units[4],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.units[4],
    columnGap: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    height: 55,
    borderRadius: 100,
  },
  textInput: {
    flex: 1,
    height: 55,
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  suggestionsContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    borderRadius: theme.units[3],
    marginTop: theme.units[2],
    paddingVertical: theme.units[2],
    zIndex: 999,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
    columnGap: theme.units[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.background.backgroundPrimary,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    flex: 1,
    fontWeight: "500",
  },
  suggestionsScrollView: {
    maxHeight: 150,
  },
}));
 