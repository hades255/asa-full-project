import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[2],
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
  disabledContainer: {
    backgroundColor: theme.colors.semanticExtensions.background.backgroundStateDisabled,
    opacity: 0.6,
  },
  input: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.semantic.content.contentInverseTertionary,
  },
  disabledText: {
    color: theme.colors.semanticExtensions.content.contentStateDisabled,
  },
  labelContainer: {
    paddingLeft: theme.units[4],
  },
}));
