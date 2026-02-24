import { View } from "react-native";
import React from "react";
import { T_ACCOR_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../../appText";
import { LeafIcon, StarIcon } from "assets/icons";
import { Location } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import { BlurView } from "expo-blur";
import ButtonWrapper from "../../buttonWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdateWishlistAPI } from "@/apis";

const AccorCard: React.FC<T_ACCOR_CARD> = ({ item, onPress }) => {
  const { theme } = useUnistyles();

  const { mutateAsync: updateWishlistAPI, isPending: updateWishlistLoading } =
    useUpdateWishlistAPI();

  // get first element of array
  const firstMediaObj = item.hotel.media.medias[0];

  // get the first image URL (first key’s value)
  const coverImageURL = firstMediaObj ? Object.values(firstMediaObj)[0] : null;

  // Rating
  const firstKey: any = item.hotel.rating
    ? Object.keys(item.hotel.rating)[0]
    : null;
  const rating = firstKey ? item.hotel.rating[firstKey] : null;

  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <View style={styles.fullWidth}>
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
          style={styles.fullLinearGrad}
        />
        {coverImageURL && (
          <Image
            source={{
              uri: coverImageURL,
            }}
            contentFit="cover"
            style={styles.fullWidthImageStyle}
          />
        )}
        <View style={styles.iconsContainer}>
          <BlurView tint="light" intensity={4} style={styles.blurEcoContainer}>
            <LeafIcon width={20} height={20} />
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInversePrimary}
            >
              {item.score}
            </AppText>
          </BlurView>
          {/* <BlurIconButton
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
          /> */}
        </View>
      </View>
      <View style={styles.fullContentContainer}>
        <View style={styles.contentHeadRow}>
          <AppText
            font="button1"
            textProps={{ numberOfLines: 1 }}
            style={{ flex: 1 }}
          >
            {item.hotel.name}
          </AppText>
          <View style={styles.rightAlignRow}>
            <StarIcon
              width={15}
              height={15}
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
            <AppText font="body2">
              {rating ? rating.score.toFixed(1) : 0}
            </AppText>
            <AppText font="body2">{`(${
              rating && rating.nbReviews ? rating.nbReviews : 0
            })`}</AppText>
          </View>
        </View>
        <View style={[styles.leftAlignRow, { width: 326 }]}>
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
            {item.hotel.localization.address.street}
          </AppText>
        </View>
        <AppText font="body1">{`$ ${item.price} min.spend`}</AppText>
      </View>
    </ButtonWrapper>
  );
};

export default AccorCard;
