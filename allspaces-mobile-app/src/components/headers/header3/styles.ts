import {
  appColors,
  appSpacings,
  appTypography,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingTop: verticalScale(appSpacings[4]),
  },
  middleContainer: {
    flex: 1,
    flexDirection: "row",
  },
  rightContainer: {
    flex: 1 / 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    ...appTypography.heading3,
    color: appColors.semantic.content.contentPrimary,
  },
});
