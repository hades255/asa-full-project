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
  header: {
    fontWeight: "500",
    marginBottom: verticalScale(8),
    marginTop: verticalScale(32),
    ...appTypography.body1,
    color: appColors.core.primaryA,
  },
  detailsHeader: {
    fontWeight: "500",
    marginBottom: verticalScale(8),
    marginTop: verticalScale(36),
    ...appTypography.body1,
    color: appColors.core.primaryA,
  },
  despText: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
    marginBottom: verticalScale(16),
  },
  mainContainer: {
    paddingHorizontal: horizontalScale(16),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  rowTerm: {
    marginBottom: verticalScale(64),

  },
  label: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: appColors.semantic.border.borderOpacue,
    marginBottom: verticalScale(8)
  },
  cardTitle: {
    ...appTypography.body2,
    color: appColors.core.primaryA,
    fontWeight: "500",
    marginBottom: 12,
  },
  value: {
    ...appTypography.caption1,
    color: appColors.core.primaryA,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(16),
  },
  totalLabel: {
    ...appTypography.body2,
    color: appColors.semanticExtensions.background.backgroundPositive,
    fontWeight: "400",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28A745',
  },

  title: {
    ...appTypography.body1,
    fontWeight: '600',
    marginBottom: verticalScale(16),
    color: '#000',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: moderateScale(40),
    padding: 16,
    width: '100%',
    marginBottom: verticalScale(16),


  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 92,
    height: 38,
    resizeMode: 'contain',
    marginRight: verticalScale(12),
    borderRadius: moderateScale(20)
  },
  cardDetails: {
    justifyContent: 'center',
  },
  paymentCardTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 14,
    color: '#AAA',
  },
  icon: {
    marginLeft: 12,
  },
});
