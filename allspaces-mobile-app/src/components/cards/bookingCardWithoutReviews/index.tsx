import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { T_UPCOMING_BOOKING_CARD } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";
import { appColors, appSpacings, horizontalScale } from "@/theme";
import { ReviewStars } from "@/components";
import { STATUS_TEXT } from "@/utils/commonText";
import { QRCodeIcon } from "assets/icons";

const BookingCardWithoutReviews: React.FC<T_UPCOMING_BOOKING_CARD> = ({
  bookingItem,
  showStatus = false,
  showQrCode = false,
  onPress,
}) => {
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <ImageBackground source={bookingItem.bgImg} style={styles.bgImg}>
        {showStatus && bookingItem.status && (
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {STATUS_TEXT[bookingItem.status]}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>
      <View style={styles.overlay}>
        <View style={styles.overlayHeading}>
          <Text style={styles.title}>{bookingItem.title}</Text>
          <Text style={styles.price}>
            {bookingItem.price}
            <Text style={styles.duration}>/{bookingItem.duration}</Text>
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View>
            <View style={styles.overlayDescription}>
              <Text style={styles.description}>{bookingItem.description}</Text>
            </View>
            <View style={[styles.overlayRating, { alignItems: "center" }]}>
              {!showQrCode && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ReviewStars reviews={bookingItem.reviews} />
                    <Text style={[styles.rating, { textAlign: "center" }]}>
                      {bookingItem.reviews}
                    </Text>
                  </View>
                  <Text style={[styles.ratingText, { textAlign: "center" }]}>
                    ({bookingItem.totalReviewsCount}) reviews
                  </Text>
                </>
              )}
              {showQrCode && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.date}>24/12/2024</Text>
                  <Text style={styles.time}>10:00 AM</Text>
                </View>
              )}
            </View>
          </View>
          {showQrCode && (
            <View
              style={{
                justifyContent: "center",
                marginRight: horizontalScale(appSpacings[4]),
              }}
            >
              <TouchableOpacity style={styles.qrCodeButton}>
                <QRCodeIcon />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ButtonWrapper>
  );
};

export default BookingCardWithoutReviews;
