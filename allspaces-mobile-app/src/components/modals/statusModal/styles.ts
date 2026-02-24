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
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  middleContainer: {
    width: horizontalScale(324),
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingVertical: verticalScale(appSpacings[4]),
    borderRadius: moderateScale(appSpacings[4]),
    backgroundColor: appColors.semantic.background.backgroundPrimary,
    rowGap: verticalScale(appSpacings[8]),
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: verticalScale(appSpacings[1]),
  },
  title: {
    ...appTypography.heading2,
    color: appColors.semantic.content.contentPrimary,
    textAlign: "center",
  },
  message: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentInverseTertionary,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: horizontalScale(appSpacings[4]),
  },
});
