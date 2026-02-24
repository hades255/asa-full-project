import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { T_BOOKING_CARD_WITH_REVIEWS } from "./types";
import { styles } from "./styles";
import { QRCodeIcon, StarIcon } from "assets/icons";
import { Ionicons } from "@expo/vector-icons";

import { appColors } from "@/theme";
import { STATUS_COLOR, STATUS_TEXT } from "@/utils/commonText";
import { LOCAL_IMGS } from "assets/images";
import { envConfig } from "@/utils/envConfig";
import { getImageUrl } from "@/utils/essentials";

const BookingCardWithReviews = ({
  item,
  onPress,
  showQrCode = false,
  showStatus = false,
  booking = false,
  onWishClick,
  status,
  date,
  price,
}: T_BOOKING_CARD_WITH_REVIEWS) => {
  const bookingStatus = status || item.status || "PENDING";
  return (
    <TouchableOpacity key={item.id} onPress={onPress} style={styles.card}>
      <ImageBackground
        source={
          item.coverMedia
            ? {
                uri: getImageUrl(item.coverMedia),
              }
            : LOCAL_IMGS.PREF_HOTEL_BG
        }
        style={styles.image}
        resizeMode="cover"
      >
        {!booking && (
          <View style={styles.favouriteContainer}>
            <TouchableOpacity
              onPress={onWishClick}
              style={styles.favouriteIcon}
            >
              {item.isInWishlist ? (
                <Ionicons name="heart" size={20} color={"red"} />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={appColors.core.primaryA}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        {showStatus && item.status && (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLOR[bookingStatus] },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {STATUS_TEXT[bookingStatus]}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${price ? price.toFixed(2) : (item.price || 0).toFixed(2)}
            </Text>
            <Text style={styles.perNight}>{"min. spend"}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={15}
                color={appColors.semantic.content.contentInverseTertionary}
              />
              <Text style={styles.location}>{item.address}</Text>
            </View>
            {/* {date && (
              <View style={styles.ratingContainer}>
                <Text style={styles.date}>
                  {moment(date).format("DD/MM/YYYY")}
                </Text>
              </View>
            )} */}
            {!showQrCode &&
              item.reviews &&
              item.reviews.length > 0 &&
              item.rating && (
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index.toString()}
                      fill={appColors.semantic.content.contentPrimary}
                    />
                  ))}
                  <Text style={styles.rating}>{item.averageRating}</Text>
                  <Text style={styles.reviews}>
                    ({item.reviews.length} reviews)
                  </Text>
                </View>
              )}
          </View>
          {showQrCode && status !== "COMPLETED" && (
            <View style={{ justifyContent: "center" }}>
              <View style={styles.qrCodeButton}>
                <QRCodeIcon />
              </View>
            </View>
          )}
        </View>

        {item.services && (
          <View style={styles.amenitiesContainer}>
            {item.services.map((service: any, index: number) => (
              <View key={index.toString()}>
                <View style={styles.amenityItem}>
                  {service.medias && (
                    <View style={styles.amenityIconContainer}>
                      <Image
                        source={
                          service.medias[0]
                            ? {
                                uri: `${envConfig.EXPO_PUBLIC_STORAGE_BASE_URL}${service.medias[0].filePath}`,
                              }
                            : require("../../../../assets/images/avatar.png")
                        }
                        style={styles.amenityIcon}
                      />
                    </View>
                  )}
                  <View style={styles.amenityContent}>
                    <Text style={styles.amenityPrice}>
                      ${service.minSpend} min. spend/hr
                    </Text>
                    <Text style={styles.amenityDescription}>
                      {service.name}
                    </Text>
                  </View>
                </View>
                {index < item.services.length - 1 && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      width: "100%",
                      marginVertical: 8,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BookingCardWithReviews;
