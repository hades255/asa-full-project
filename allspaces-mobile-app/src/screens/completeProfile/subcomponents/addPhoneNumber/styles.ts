import { appSpacings, horizontalScale, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bodyContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    rowGap: verticalScale(appSpacings[9]),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: horizontalScale(appSpacings[4]),
  },
});
