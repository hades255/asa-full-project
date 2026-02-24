import { View, ScrollView, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import {
  AppButton,
  AppText,
  BackButton,
  BlurIconButton,
  Chip,
  ImageSlider,
  ReviewSlider,
  ServiceCard,
} from "@/components";
import { styles } from "./styles";
import { T_ACCOR_DETAILS_SCREEN } from "./types";
import { showSnackbar } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";
import { LeafIcon, StarIcon } from "assets/icons";
import { BlurView } from "expo-blur";
import { Heart, Location } from "iconsax-react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReviewCard from "@/components/reviewCard";
import { API_ROUTES, useGetProfileByIdAPI, useUpdateWishlistAPI } from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import { T_PROFILE_SERVICE } from "@/components/cards/bookingCardWithReviews/types";
import { useProfileProvider } from "@/hooks/useProfileProvider";

const AccorDetailsScreen: React.FC<T_ACCOR_DETAILS_SCREEN> = ({
  navigation,
  route,
}) => {
  let { profile: accorItem } = route.params;

  console.log(accorItem.hotel.media);

  const { isProfileCompleted, checkProfileCompletion } = useProfileProvider();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  // const [selectedServices, setSelectedServices] = useState<T_PROFILE_SERVICE[]>(
  //   []
  // );
  // const { data: profile, isPending } = useGetProfileByIdAPI(vendorProfile.id);

  // const { mutateAsync: updateWishlistAPI, isPending: updateWishlistLoading } =
  //   useUpdateWishlistAPI();

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  // const onServiceClick = (item: T_PROFILE_SERVICE) => {
  //   let alreadyAdded = selectedServices.find(
  //     (service) => service.name === item.name
  //   );
  //   if (alreadyAdded) {
  //     setSelectedServices((prev) =>
  //       prev.filter((service, sIndex) => service.name != item.name)
  //     );
  //   } else setSelectedServices((prev) => [...prev, item]);
  // };

  const onBookNowClick = () => {
    if (!isProfileCompleted) {
      showSnackbar(`You need to complete your profile first!`, "warning");
      return;
    }

    // if (selectedServices.length == 0) {
    //   showSnackbar(`Please select at least one service`, "warning");
    //   return;
    // }

    // if (!profile) return;

    // navigation.navigate("BookingOrderDetailScreen", {
    //   profile: profile,
    //   services: selectedServices,
    // });
  };

  const firstKey: any = accorItem.hotel.rating
    ? Object.keys(accorItem.hotel.rating)[0]
    : null;
  const rating = firstKey ? accorItem.hotel.rating[firstKey] : null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sliderContainer}>
        <ImageSlider
          images={accorItem.hotel.media.medias.map(
            (obj) => Object.values(obj)[0]
          )}
        />
        <View style={[styles.overlayIconsHeader, { marginTop: insets.top }]}>
          <BackButton />
          <View style={styles.overlayRightIcons}>
            <BlurView tint="light" intensity={4} style={styles.ecoContainer}>
              <LeafIcon width={20} height={20} />
              <AppText
                font="body1"
                color={theme.colors.semantic.content.contentInversePrimary}
              >
                {accorItem.score}
              </AppText>
            </BlurView>
            {/* <BlurIconButton
              icon={
                updateWishlistLoading ? (
                  <ActivityIndicator
                    size={"small"}
                    color={
                      theme.colors.semanticExtensions.content.contentAccent
                    }
                  />
                ) : profile.isInWishlist ? (
                  <AntDesign
                    onPress={async () => {
                      await updateWishlistAPI({
                        profileId: profile.id,
                        isWishlisted: profile.isInWishlist,
                      });
                      queryClient.invalidateQueries({
                        queryKey: [
                          API_ROUTES.GET_PROFILES_BY_ID,
                          vendorProfile.id,
                        ],
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
                        profileId: profile.id,
                        isWishlisted: profile.isInWishlist,
                      });
                      queryClient.invalidateQueries({
                        queryKey: [
                          API_ROUTES.GET_PROFILES_BY_ID,
                          vendorProfile.id,
                        ],
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
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyScrollContainer}
      >
        <View style={[styles.section, styles.sectionHPadding]}>
          <View style={styles.sectionRow}>
            <AppText font="heading4" style={{ flex: 1 }}>
              {accorItem.hotel.name}
            </AppText>
            <View style={styles.rightAlignRow}>
              <StarIcon
                width={16}
                height={16}
                color={theme.colors.semanticExtensions.content.contentAccent}
              />
              <AppText font="body2">{rating ? rating.score : 0.0}</AppText>
              <AppText font="body2">{`(${
                rating ? rating.nbReviews : 0
              })`}</AppText>
            </View>
          </View>
          <View style={styles.leftAlignRow}>
            <Location
              size={16}
              color={theme.colors.semantic.content.contentInverseTertionary}
            />
            <AppText
              font="body2"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >
              {accorItem.hotel.localization.address.street}
            </AppText>
          </View>
          <AppText font="body1">{`~ $ ${accorItem.price} min.spend`}</AppText>
        </View>
        <View style={styles.separator} />

        {/* Description */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Description`}</AppText>
          <AppText font="caption1">{accorItem.hotel.description}</AppText>
        </View>
        <View style={styles.separator} />

        {/* Amenities */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Amenities`}</AppText>
          <View style={styles.wrappedView}>
            {accorItem.hotel.amenity.free.map((item, index) => (
              <Chip key={index.toString()} text={item} />
            ))}
          </View>
        </View>
        <View style={styles.separator} />

        {/* Services */}
        {/* <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Services`}</AppText>
          <View style={{ rowGap: theme.units[3] }}>
            {profile.services.map((item, index) => (
              <ServiceCard
                service={item}
                key={index.toString()}
                isSelected={
                  !!selectedServices.find(
                    (service) => service.name === item.name
                  )
                }
                onPress={() => onServiceClick(item)}
              />
            ))}
          </View>
        </View>
        <View style={styles.separator} /> */}

        {/* Reviews */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <View style={{ columnGap: theme.units[1] }}>
            <AppText font="heading4">{`What people say`}</AppText>
            <View style={styles.leftAlignRow}>
              {Array(5)
                .fill("1")
                .map((_, index) => (
                  <StarIcon
                    key={index.toString()}
                    width={16}
                    height={16}
                    color={
                      theme.colors.semanticExtensions.content.contentAccent
                    }
                  />
                ))}
              <AppText font="body2">
                {rating ? rating.score.toFixed(1) : 0.0}
              </AppText>
              <AppText font="body2">{` (${
                rating && rating.nbReviews ? rating.nbReviews : 0
              })`}</AppText>
            </View>
          </View>
          {/* <View style={{ rowGap: theme.units[1] }}>
            {Object.keys(profile.rating).map((key, keyIndex) => {
              return (
                <ReviewSlider
                  key={keyIndex.toString()}
                  label={(keyIndex + 1).toString()}
                  // @ts-ignore
                  reviewCount={profile.rating[key]}
                  percentage={`${
                    // @ts-ignore
                    (profile.rating[key] / profile.totalReviews) * 100
                  }%`}
                />
              );
            })}
          </View> */}
          {/* <FlatList
            horizontal
            data={profile.reviews}
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ columnGap: theme.units[3] }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <ReviewCard review={item} />}
          /> */}
        </View>
      </ScrollView>
      <View style={styles.actionContainer}>
        <AppButton title="Book Now" onPress={onBookNowClick} />
      </View>
    </View>
  );
};

export default AccorDetailsScreen;
