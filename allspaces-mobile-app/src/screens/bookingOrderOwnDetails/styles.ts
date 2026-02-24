import {
  appColors,
  appTypography,
  horizontalScale,
  verticalScale,
} from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: horizontalScale(16),
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkInAndTime: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    ...appTypography.body1,
    color: appColors.core.primaryA,
    paddingTop: verticalScale(36),
    paddingBottom: verticalScale(16),
  },
  checkInText: {
    ...appTypography.body1,
    color: appColors.core.primaryA,
    paddingLeft: horizontalScale(16),
  },
  timeText: {
    ...appTypography.body1,
    color: appColors.core.primaryA,
    paddingLeft: horizontalScale(100),
  },
  divider: {
    height: 1,
    backgroundColor: appColors.semantic.border.borderOpacue,
    marginVertical: verticalScale(16),
  },
  container: {
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: verticalScale(10),
    ...appTypography.body1,
    color: appColors.core.primaryA,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  label: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
  },
  amount: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
  },
  totalLabel: {
    ...appTypography.body2,
    color: appColors.semanticExtensions.background.backgroundPositive,
  },
  totalAmount: {
    ...appTypography.body2,
    color: appColors.semanticExtensions.background.backgroundPositive,
  },
});
