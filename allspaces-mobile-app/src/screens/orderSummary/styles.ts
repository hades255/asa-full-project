import {
  appColors,
  appTypography,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  qrCode: {
    height: verticalScale(166),
    width: horizontalScale(166),
    alignSelf: "center",
    marginTop: verticalScale(43),
    marginBottom: verticalScale(16),
  },
  qrCodeContainer: {
    alignSelf: "center",
    marginTop: verticalScale(43),
    marginBottom: verticalScale(16),
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: appColors.semantic.border.borderOpacue,
    marginBottom: verticalScale(8),
  },
  cardTitle: {
    ...appTypography.body2,
    color: appColors.core.primaryA,
    fontWeight: "400",
    marginBottom: 12,
  },
  value: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",

    marginBottom: verticalScale(32),
  },
  totalLabel: {
    ...appTypography.body2,
    color: appColors.semanticExtensions.background.backgroundPositive,
    fontWeight: "400",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28A745",
  },
  mainContainer: {
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    fontWeight: "500",
    marginBottom: verticalScale(8),
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
});
