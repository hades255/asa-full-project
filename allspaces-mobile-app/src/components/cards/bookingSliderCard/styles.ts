import {
  appColors,
  appRadius,
  appSpacings,
  appTypography,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    marginRight: verticalScale(appSpacings[3]),
    height: verticalScale(288),
    borderRadius: moderateScale(appRadius[4]),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: appColors.semantic.border.borderTransparent,
  },
  overlay: {
    flex: 1,
    backgroundColor:
      appColors.semanticExtensions.background.backgroundAlwaysLight,
  },
  bgImg: {
    width: "100%",
    height: verticalScale(180),
  },
  overlayHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: verticalScale(appSpacings[4]),
    paddingHorizontal: horizontalScale(appSpacings[4]),
  },
  overlayDescription: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingTop: verticalScale(appSpacings[1]),
  },
  title: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
    textAlign: "center",
  },
  price: {
    ...appTypography.heading3,
    color: appColors.semantic.content.contentPrimary,
  },
  duration: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  description: {
    ...appTypography.caption1,
    color: appColors.semantic.content.contentInverseTertionary,
  },
  overlayRating: {
    flexDirection: "row",
    gap: moderateScale(appSpacings[2]),
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingTop: verticalScale(appSpacings[1]),
    alignItems: "center",
  },
  ratingStar: {
    marginRight: moderateScale(appSpacings[1]),
  },
  rating: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  ratingText: {
    ...appTypography.caption1,
    color: appColors.semantic.content.contentInverseTertionary,
    paddingTop: verticalScale(appSpacings[1]),
  },
  starImg: {
    color: appColors.semantic.content.contentInversePrimary,
  },
});
