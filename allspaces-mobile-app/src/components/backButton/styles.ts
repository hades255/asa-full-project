import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
  },
}));
