import { View } from "react-native";
import React from "react";
import { T_VENDOR_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import { StarIcon } from "assets/icons";
import { useNavigation } from "@react-navigation/native";

const VendorCard: React.FC<T_VENDOR_CARD> = ({
  profile,
  onPress,
  disabled,
}) => {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: profile.coverMedia,
            }}
            contentFit="cover"
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.leftContent}>
          <AppText font="body2">{profile.name}</AppText>
          <View style={styles.leftAlignRow}>
            <StarIcon
              width={16}
              height={16}
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
            <AppText font="body2">{profile.averageRating.toFixed(1)}</AppText>
            <AppText font="body2">{`(${profile.totalReviews})`}</AppText>
          </View>
          {!disabled && (
            <AppText
              textProps={{
                onPress: onPress,
              }}
              font="caption1"
              color={theme.colors.semanticExtensions.content.contentAccent}
              style={{ textDecorationLine: "underline" }}
            >{`View Space`}</AppText>
          )}
        </View>
      </View>
    </View>
  );
};

export default VendorCard;
