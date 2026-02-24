import { StyleSheet } from "react-native-unistyles";
import { horizontalScale, verticalScale } from "./responsive";
import { appSpacings } from "./others";
import { appTypography } from "./typography";
import { appColors } from "./colors";

export const globalStyles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
  },
  screenPadding: {
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingVertical: verticalScale(appSpacings[6]),
  },
  rowGap12: {
    rowGap: verticalScale(appSpacings[3]),
  },
  rowGap20: {
    rowGap: verticalScale(appSpacings[5]),
  },
  rowGap32: {
    rowGap: verticalScale(appSpacings[8]),
  },
  h16Padding: {
    paddingHorizontal: horizontalScale(appSpacings[4]),
  },
  v24Padding: {
    paddingVertical: verticalScale(appSpacings[6]),
  },
  screenHeadingContainer: {
    rowGap: verticalScale(appSpacings[1]),
  },
  screenHeading: {
    ...appTypography.heading2,
    color: appColors.semantic.content.contentPrimary,
  },
  screenInfo: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentInverseTertionary,
  },
  secondaryLink1: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentInverseTertionary,
    alignSelf: "center",
  },
  secondaryLink2: {
    ...appTypography.button1,
    color: appColors.semantic.content.contentPrimary,
  },
  formContainer: {
    rowGap: verticalScale(appSpacings[4]),
  },
  labelContainer: {
    width: "100%",
    paddingHorizontal: horizontalScale(appSpacings[4]),
  },
  label: {
    ...appTypography.button1,
    color: appColors.semantic.content.contentPrimary,
  },
  errorContainer: {
    width: "100%",
    paddingHorizontal: horizontalScale(appSpacings[4]),
  },
  errorText: {
    ...appTypography.caption1,
    color: appColors.semanticExtensions.content.contentNegative,
  },
  textLink: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
    textDecorationLine: "underline",
  },
  primaryLink1: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  primaryLink2: {
    ...appTypography.button1,
    color: appColors.semantic.content.contentPrimary,
    textDecorationLine: "underline",
  },
}));
