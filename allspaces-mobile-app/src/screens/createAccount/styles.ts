import { horizontalScale } from "@/theme";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    rowGap: theme.units[9],
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
  },
  orSeparator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: horizontalScale(theme.units[3]),
  },
  line: {
    flex: 1,
    height: 1,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.background.backgroundSecondary,
  },
}));
