import { appColors, appTypography, moderateScale } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(100),
    justifyContent: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(4),
    alignItems: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: moderateScale(5),
  },
  leafIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },
  scoreText: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  scoreHeader: {
    ...appTypography.caption1,
    color: appColors.semantic.content.contentTertionary,
  },
});
