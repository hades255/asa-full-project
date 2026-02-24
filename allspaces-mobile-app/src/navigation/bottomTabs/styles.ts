import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    height: Platform.OS === "android" ? 124 : 80,
    boxShadow: "0 -3  12  4 rgba(0,0,0,0.1)",
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
    paddingHorizontal: theme.units[4],
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTabItem: {
    columnGap: theme.units[2],
    paddingHorizontal: theme.units[3],
    paddingVertical: theme.units[2],
    backgroundColor:
      theme.colors.semanticExtensions.background.backgroundAccent,
    borderRadius: 100,
  },
}));
