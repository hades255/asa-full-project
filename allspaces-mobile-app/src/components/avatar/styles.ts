import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  editIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  uploadContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
}));
