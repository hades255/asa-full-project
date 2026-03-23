import { View } from "react-native";
import React, { memo } from "react";
import { T_SPACE_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../appText";
import { StarIcon } from "assets/icons";
import { Heart, Location, Ranking, Scan } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import BlurIconButton from "../blurIconButton";
import { BlurView } from "expo-blur";
import ButtonWrapper from "../buttonWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdateWishlistAPI } from "@/apis";
import { AntDesign } from "@expo/vector-icons";

const SpaceCard: React.FC<T_SPACE_CARD> = ({
  isBooked,
  space,
  onPress,
  onScanPress,
  fullWidth,
}) => {
  const { theme } = useUnistyles();
  const { mutate: updateWishlist } = useUpdateWishlistAPI();

  const handleWishlistToggle = () => {
    updateWishlist({
      profileId: space.id,
      isWishlisted: space.isInWishlist,
    });
  };

  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <View style={fullWidth ? styles.fullWidth : styles.imgContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
          style={fullWidth ? styles.fullLinearGrad : styles.linearGrad}
        />
        <Image
          source={{
            uri: space.coverMedia,
          }}
          contentFit="cover"
          style={fullWidth ? styles.fullWidthImageStyle : styles.imgStyle}
        />
        {typeof space.matchScore === "number" && (
          <View style={styles.scoreBadgeContainer}>
            <BlurView tint="light" intensity={4} style={styles.scoreBadge}>
              <Ranking
                size={18}
                color={theme.colors.semantic.content.contentInversePrimary}
                variant="Bold"
              />
              <AppText
                font="caption1"
                color={theme.colors.semantic.content.contentInversePrimary}
              >
                {(space.matchScore * 100).toFixed(0)}%
              </AppText>
            </BlurView>
          </View>
        )}
        <View style={styles.iconsContainer}>
          <BlurIconButton
            onPress={isBooked ? undefined : handleWishlistToggle}
            icon={
              isBooked ? (
                <Scan
                  size={24}
                  color={theme.colors.semantic.content.contentInversePrimary}
                  onPress={onScanPress}
                />
              ) : space.isInWishlist ? (
                <AntDesign
                  name="heart"
                  size={24}
                  color={theme.colors.core.negative}
                />
              ) : (
                <Heart
                  size={24}
                  color={theme.colors.semantic.content.contentInversePrimary}
                />
              )
            }
          />
        </View>
      </View>
      <View
        style={
          fullWidth ? styles.fullContentContainer : styles.contentContainer
        }
      >
        <View style={styles.contentHeadRow}>
          <AppText
            font="button1"
            textProps={{ numberOfLines: 1 }}
            style={{ flex: 1 }}
          >
            {space.name}
          </AppText>
          <View style={styles.rightAlignRow}>
            <StarIcon
              width={15}
              height={15}
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
            <AppText font="body2">{space.averageRating.toFixed(1)}</AppText>
            <AppText font="body2">{`(${space.totalReviews})`}</AppText>
          </View>
        </View>
        <View style={[styles.leftAlignRow, { width: fullWidth ? 326 : 300 }]}>
          <Location
            size={16}
            color={theme.colors.semantic.content.contentInverseTertionary}
          />
          <AppText
            font="body2"
            color={theme.colors.semantic.content.contentInverseTertionary}
            textProps={{
              numberOfLines: 1,
            }}
          >
            {space.address}
          </AppText>
        </View>
        <AppText font="body1">{`£ ${space.services[0].minSpend.toFixed(
          2
        )} min.spend`}</AppText>
      </View>
    </ButtonWrapper>
  );
};

export default memo(SpaceCard);
