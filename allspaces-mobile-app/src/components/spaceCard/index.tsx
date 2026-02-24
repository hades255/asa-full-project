import { ActivityIndicator, View } from "react-native";
import React from "react";
import { T_SPACE_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../appText";
import { StarIcon } from "assets/icons";
import { Heart, Location, Scan } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import BlurIconButton from "../blurIconButton";
import ButtonWrapper from "../buttonWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdateWishlistAPI } from "@/apis";
import { AntDesign } from "@expo/vector-icons";
import QrModal from "../modals/qrModal";

const SpaceCard: React.FC<T_SPACE_CARD> = ({
  isBooked,
  space,
  onPress,
  onScanPress,
  fullWidth,
}) => {
  const { theme } = useUnistyles();

  const { mutateAsync: updateWishlistAPI, isPending: updateWishlistLoading } =
    useUpdateWishlistAPI();

  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <QrModal />
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
        <View style={styles.iconsContainer}>
          <BlurIconButton
            icon={
              isBooked ? (
                <Scan
                  size={24}
                  color={theme.colors.semantic.content.contentInversePrimary}
                  onPress={onScanPress}
                />
              ) : updateWishlistLoading ? (
                <ActivityIndicator
                  size={"small"}
                  color={theme.colors.semanticExtensions.content.contentAccent}
                />
              ) : space.isInWishlist ? (
                <AntDesign
                  onPress={async () => {
                    await updateWishlistAPI({
                      profileId: space.id,
                      isWishlisted: space.isInWishlist,
                    });
                  }}
                  name="heart"
                  size={24}
                  color={theme.colors.core.negative}
                />
              ) : (
                <Heart
                  onPress={async () => {
                    await updateWishlistAPI({
                      profileId: space.id,
                      isWishlisted: space.isInWishlist,
                    });
                  }}
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
        <AppText font="body1">{`$ ${space.services[0].minSpend.toFixed(
          2
        )} min.spend`}</AppText>
      </View>
    </ButtonWrapper>
  );
};

export default SpaceCard;
