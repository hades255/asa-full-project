import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { T_WISHLIST_CARD } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";
import { appColors, appSpacings, horizontalScale } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { STATUS_TEXT } from "@/utils/commonText";
import { QRCodeIcon } from "assets/icons";
import { LOCAL_IMGS } from "assets/images";
import { getImageUrl } from "@/utils/essentials";

const WishlistCard: React.FC<T_WISHLIST_CARD> = ({
  bookingItem,
  showStatus = false,
  showQrCode = false,
  onPress,
  handleRemoveFromWishlist,
}) => {
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <ImageBackground
        source={
          bookingItem.coverMedia
            ? { uri: getImageUrl(bookingItem.coverMedia) }
            : LOCAL_IMGS.PREF_HOTEL_BG
        }
        style={styles.bgImg}
      >
        {
          <View style={styles.favouriteContainer}>
            <TouchableOpacity
              onPress={handleRemoveFromWishlist}
              style={styles.favouriteIcon}
            >
              <Ionicons name="heart" size={20} color={"red"} />
            </TouchableOpacity>
          </View>
        }
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
          <Text style={styles.title}>{bookingItem.name}</Text>
          <Text style={styles.price}>
            {"£ 99 "}
            <Text style={styles.duration}>min spend. /hr</Text>
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={15}
                color={appColors.semantic.content.contentInverseTertionary}
              />
              <Text style={styles.location}>{bookingItem.location}</Text>
            </View>
            <View style={styles.overlayDescription}>
              <Text style={styles.description}>{bookingItem.description}</Text>
            </View>
            <View style={[styles.overlayRating, { alignItems: "center" }]}>
              {/* {!showQrCode && (
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
              )} */}
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

export default WishlistCard;
