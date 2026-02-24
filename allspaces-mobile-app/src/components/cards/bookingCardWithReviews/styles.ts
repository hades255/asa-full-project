import {
  appColors,
  appSpacings,
  appTypography,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  //search results styles

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#000",
  },
  statusContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: verticalScale(appSpacings[3]),
    marginRight: horizontalScale(appSpacings[3]),
  },
  statusBadge: {
    paddingVertical: verticalScale(appSpacings[2]),
    paddingHorizontal: horizontalScale(appSpacings[4]),
    borderRadius: moderateScale(100),
  },
  statusBadgeText: {
    ...appTypography.body2,
    color: appColors.core.primaryB,
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
  ecoScore: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: verticalScale(appSpacings[3]),
    marginRight: horizontalScale(appSpacings[3]),
  },
  filterButtonText: {
    ...appTypography.body2,
    color: appColors.core.primaryB,
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeCategoryButton: {
    backgroundColor: "#000",
  },
  categoryButtonText: {
    ...appTypography.caption1,
    color: appColors.semantic.content.contentPrimary,
  },
  activeCategoryButtonText: {
    color: "#fff",
  },
  bookingContainer: {
    flex: 1,
  },

  searchContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: appColors.semantic.border.borderTransparent,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: width * 0.5,
  },
  contentContainer: {
    padding: moderateScale(16),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    // fontSize: 24,
    // fontWeight: 'bold',
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    // fontSize: 24,
    fontWeight: "bold",

    ...appTypography.heading3,
    color: appColors.semantic.content.contentPrimary,
  },
  perNight: {
    fontSize: 16,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    // fontSize: 16,
    // color: '#666',
    marginLeft: 4,

    ...appTypography.caption1,
    color: appColors.semantic.content.contentInverseTertionary,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    // fontSize: 16,
    // fontWeight: 'bold',
    marginLeft: 4,
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  qrCodeButton: {
    backgroundColor: appColors.semantic.background.backgroundTertionary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(appSpacings[3]),
    paddingHorizontal: horizontalScale(appSpacings[3]),
    borderRadius: moderateScale(32),
    marginBottom: verticalScale(appSpacings[3]),
  },
  date: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
  },
  reviews: {
    // fontSize: 16,
    // color: '#666',
    marginLeft: 4,
    marginTop: 3,

    ...appTypography.body2,
    color: appColors.semantic.content.contentInverseTertionary,
  },
  ecoPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ecoPoints: {
    fontSize: 16,
    marginLeft: 4,
    color: "#4CAF50",
  },
  amenitiesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: horizontalScale(appSpacings[2]),
  },
  amenityItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amenityIconContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(40),
    backgroundColor: "#f5f5f5",
    marginRight: 12,
    overflow: "hidden",
  },
  amenityIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(40),
  },
  amenityContent: {
    flex: 1,
  },
  amenityPrice: {
    ...appTypography.caption2,
    color: appColors.semantic.content.contentPrimary,
  },
  amenityDescription: {
    ...appTypography.caption2,
    color: appColors.semantic.content.contentInverseTertionary,
  },
});
