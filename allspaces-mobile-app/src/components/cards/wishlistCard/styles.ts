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
    marginVertical: verticalScale(appSpacings[3]),
    marginHorizontal: horizontalScale(appSpacings[4]),
    height: verticalScale(288),
    borderRadius: moderateScale(appRadius[4]),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: appColors.semantic.border.borderTransparent,
  },
  ecoScore: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: verticalScale(appSpacings[3]),
    marginRight: horizontalScale(appSpacings[3]),
  },
  statusContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: verticalScale(appSpacings[3]),
    marginRight: horizontalScale(appSpacings[3]),
  },
  statusBadge: {
    backgroundColor: appColors.core.warning,
    paddingVertical: verticalScale(appSpacings[2]),
    paddingHorizontal: horizontalScale(appSpacings[4]),
    borderRadius: moderateScale(100),
  },
  statusBadgeText: {
    ...appTypography.body2,
    color: appColors.core.primaryB,
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
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCodeButton: {
    backgroundColor: appColors.semantic.background.backgroundTertionary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(appSpacings[3]),
    paddingHorizontal: horizontalScale(appSpacings[3]),
    borderRadius: moderateScale(32),
  },
  title: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: horizontalScale(appSpacings[3]),
  },
  favouriteContainer: {
    flex: 1,
    // justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: verticalScale(appSpacings[4]),
    marginRight: horizontalScale(appSpacings[4]),
  },
  favouriteIcon: {
    backgroundColor: appColors.semantic.content.contentInversePrimary,
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  location: {
    // fontSize: 16,
    // color: '#666',
    ...appTypography.caption1,
    color: appColors.semantic.content.contentInverseTertionary,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
    marginRight: horizontalScale(appSpacings[2]),
  },
  time: {
    ...appTypography.caption1,
    color: appColors.semantic.content.contentInverseTertionary,
  },

  //reviews
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  reviewPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
