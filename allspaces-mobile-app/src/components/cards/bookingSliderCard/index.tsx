import { View, Text } from "react-native";
import React from "react";
import { T_UPCOMING_BOOKING_CARD } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";
import { Image } from "expo-image";
import { ReviewStars } from "@/components";
import { envConfig } from "@/utils/envConfig";
import { calculateAverageRating } from "@/utils/essentials";
import { useNavigation } from "@react-navigation/native";

const FullWidthCardWithoutReviews: React.FC<T_UPCOMING_BOOKING_CARD> = ({
  bookingItem,
}) => {
  const navigation = useNavigation<any>();
  return (
    <ButtonWrapper
      onPress={() =>
        navigation.navigate("BookingDetailScreen", {
          createYourOwn: false,
          profileId: bookingItem.id,
          source: bookingItem.source,
        })
      }
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <Image
        source={{
          uri: `${envConfig.EXPO_PUBLIC_STORAGE_BASE_URL}${bookingItem.coverMedia}`,
        }}
        contentFit="cover"
        contentPosition={"center"}
        style={styles.bgImg}
      />
      <View style={styles.overlay}>
        <View style={styles.overlayHeading}>
          <Text style={styles.title}>{bookingItem.name}</Text>
          <Text style={styles.price}>
            {bookingItem.price}
            <Text style={styles.duration}>/hr</Text>
          </Text>
        </View>
        <View style={styles.overlayDescription}>
          <Text style={styles.description}>{bookingItem.description}</Text>
        </View>
        {bookingItem.totalReviews > 0 && (
          <View style={[styles.overlayRating, { alignItems: "center" }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ReviewStars
                reviews={calculateAverageRating(
                  bookingItem.oneStarCount,
                  bookingItem.twoStarCount,
                  bookingItem.threeStarCount,
                  bookingItem.fourStarCount,
                  bookingItem.fiveStarCount,
                  bookingItem.totalReviews
                )}
              />
              <Text style={[styles.rating, { textAlign: "center" }]}>
                {calculateAverageRating(
                  bookingItem.oneStarCount,
                  bookingItem.twoStarCount,
                  bookingItem.threeStarCount,
                  bookingItem.fourStarCount,
                  bookingItem.fiveStarCount,
                  bookingItem.totalReviews
                )}
              </Text>
            </View>
            <Text style={[styles.ratingText, { textAlign: "center" }]}>
              ({bookingItem.totalReviews}) reviews
            </Text>
          </View>
        )}
      </View>
    </ButtonWrapper>
  );
};

export default FullWidthCardWithoutReviews;
