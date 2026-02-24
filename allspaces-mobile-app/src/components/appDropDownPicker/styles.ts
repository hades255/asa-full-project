import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[2],
  },
  labelContainer: {
    paddingLeft: theme.units[4],
  },
  inputContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[4],
    height: 55,
    borderRadius: 100,
    paddingHorizontal: theme.units[4],
  },
  inputLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[4],
  },
  selectedText: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  arrowIcon: {
    transform: [{ rotate: '0deg' }],
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  optionsContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    borderRadius: theme.units[3],
    marginTop: theme.units[2],
    paddingVertical: theme.units[2],
    zIndex: 999,
    overflow: "hidden",
    maxHeight: 200,
  },
  optionItem: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.background.backgroundPrimary,
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  selectedOptionItem: {
    backgroundColor: theme.colors.semanticExtensions.background.backgroundAccent,
  },
  optionText: {
    ...theme.typography.body2,
    color: theme.colors.semantic.content.contentPrimary,
  },
  selectedOptionText: {
    fontWeight: "600",
    color: theme.colors.semanticExtensions.content.contentAccent,
  },
  optionsScrollView: {
    maxHeight: 150,
  },
}));
