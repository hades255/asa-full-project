import { appSpacings, verticalScale } from "@/theme";
import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[9],
    rowGap: theme.units[9],
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headingContainer: {},
}));
