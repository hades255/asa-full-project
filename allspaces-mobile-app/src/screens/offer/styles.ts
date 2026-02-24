import { appColors, appTypography, horizontalScale, moderateScale, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: horizontalScale(16)
    },
    imageContainer: {
        width: "100%",
        height: verticalScale(250),
        alignSelf: "center",
        marginTop: verticalScale(43),
        marginBottom: verticalScale(16),
    },
    bookingDetailsImage: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(15),
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: verticalScale(8),
    },
    bookingDetailsTitle: {
        fontSize: moderateScale(24),
        fontWeight: "500",
    },
    bookingDetailsPrice: {
        fontSize: moderateScale(20),
        fontWeight: "400",
    },
    night: {
        fontSize: moderateScale(14),
        color: "#666",
    },
    bookingDetailsLocation: {
        ...appTypography.caption1,
        color: appColors.semantic.content.contentInverseTertionary,
        marginBottom: verticalScale(32),
    },
    noteSection: {
    },
    noteTitle: {
        fontWeight: "600",
        marginBottom: verticalScale(16),
        ...appTypography.body1,
        color: appColors.core.primaryA,
    },
    noteText: {
        color: 'red',
        ...appTypography.caption1,
        marginBottom: verticalScale(16),
    },
    availabilityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    availabilityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(9),
        borderBottomWidth: 1,
        borderColor: appColors.semantic.border.borderOpacue,
        // backgroundColor: appColors.semantic.border.borderOpacue,
        marginBottom: verticalScale(8)
    },
    selectedItem: {
        borderColor: 'green',
        borderWidth: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    availabilityTextContainer: {
        flex: 1,
    },
    availabilityTime: {
        ...appTypography.body1,
        color: appColors.core.primaryA,
        fontWeight: '400',
    },
    availabilityDuration: {
        ...appTypography.caption1,
        color: appColors.semantic.content.contentTertionary,
        fontWeight: '400',
    },
    checkmark: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: verticalScale(8)
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
        fontWeight: "400",
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

        marginBottom: verticalScale(32),
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
    header: {
        fontWeight: "500",
        marginBottom: verticalScale(8),
        marginTop: verticalScale(8),
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
