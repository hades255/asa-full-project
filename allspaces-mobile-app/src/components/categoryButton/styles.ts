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
  filterItem: {
    paddingHorizontal: horizontalScale(appSpacings[4]),
    paddingVertical: verticalScale(appSpacings[2]),
    backgroundColor: appColors.semantic.background.backgroundSecondary,
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: appColors.semantic.border.borderTransparent,
  },
  filterText: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
});
