import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  middleContainer: {
    width: 324,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[4],
    borderRadius: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
    rowGap: theme.units[8],
    alignItems: "center",
    justifyContent: "center",
  },
}));
