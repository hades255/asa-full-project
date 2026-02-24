import {
  appColors,
  appSpacings,
  appTypography,
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
  loaderContainer: {
    padding: moderateScale(appSpacings[8]),
    borderRadius: moderateScale(appSpacings[4]),
    backgroundColor: appColors.semantic.background.backgroundPrimary,
    rowGap: verticalScale(appSpacings[4]),
  },
  message: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
});
