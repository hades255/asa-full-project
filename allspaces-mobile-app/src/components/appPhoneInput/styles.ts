import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[2],
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.border.borderSelected,
    paddingHorizontal: theme.units[4],
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    height: 55,
  },
  phoneInputStyle: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  codeTextStyle: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  inputContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[4],
    height: 55,
    borderRadius: 100,
    paddingHorizontal: theme.units[4],
    overflow: "hidden",
  },
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[2],
  },
  input: {
    flex: 1,
    height: "100%",
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  labelContainer: {
    paddingLeft: theme.units[4],
  },
  errorContainer: {
    paddingLeft: theme.units[4],
  },
}));