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
  input: {
    flex: 1,
    height: "100%",
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  textboxContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    flexDirection: "row",
    columnGap: theme.units[4],
    height: 200,
    borderRadius: theme.units[4],
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
  },
  labelContainer: {
    paddingLeft: theme.units[4],
  },
  errorContainer: {
    paddingLeft: theme.units[4],
  },
}));
