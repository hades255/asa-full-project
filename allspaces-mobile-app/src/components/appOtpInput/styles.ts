import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: theme.units[4],
  },
  pinCodeContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.units[3],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.semantic.border.borderSelected,
  },
  pinCodeText: {
    ...theme.typography.heading3,
    color: theme.colors.semantic.content.contentPrimary,
  },
  focusStick: {
    height: 24,
    width: 1,
  },
  filledPinCodeContainer: {
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.semantic.border.borderSelected,
  },
}));
