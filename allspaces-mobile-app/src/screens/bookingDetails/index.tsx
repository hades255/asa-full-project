import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

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
import { T_BOOKING_DETAILS_SCREEN } from "./types";
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

const MemoReviewCard = memo(ReviewCard);

const BookingDetailsScreen: React.FC<T_BOOKING_DETAILS_SCREEN> = ({
  navigation,
  route,
}) => {
  const { profile: vendorProfile, hideBookNow } = route.params;
  console.log('hideBookNow', hideBookNow);

  const queryClient = useQueryClient();
  const { isProfileCompleted, checkProfileCompletion } = useProfileProvider();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [selectedServices, setSelectedServices] = useState<T_PROFILE_SERVICE[]>(
    []
  );
  const { data: profile, isPending } = useGetProfileByIdAPI(
    vendorProfile.id || (vendorProfile as any).hotel?.id || ""
  );

  const { mutateAsync: updateWishlistAPI, isPending: updateWishlistLoading } =
    useUpdateWishlistAPI();

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const onServiceClick = useCallback((item: T_PROFILE_SERVICE) => {
    setSelectedServices((prev) => {
      const found = prev.find((service) => service.name === item.name);
      return found
        ? prev.filter((service) => service.name !== item.name)
        : [...prev, item];
    });
  }, []);

  const onBookNowClick = useCallback(() => {
    if (!isProfileCompleted) {
      showSnackbar(`You need to complete your profile first!`, "warning");
      return;
    }

    if (selectedServices.length == 0) {
      showSnackbar(`Please select at least one service`, "warning");
      return;
    }

    if (!profile) return;

    navigation.navigate("BookingOrderDetailScreen", {
      profile: profile,
      services: selectedServices,
    });
  }, [isProfileCompleted, navigation, profile, selectedServices]);

  const sliderImages = useMemo(
    () => (profile ? profile.media.map((item) => item.url) : []),
    [profile?.media]
  );

  const facilities = useMemo(
    () => (profile ? profile.facilities : []),
    [profile?.facilities]
  );

  const services = useMemo(
    () => (profile ? profile.services : []),
    [profile?.services]
  );

  const reviews = useMemo(
    () => (profile ? profile.reviews : []),
    [profile?.reviews]
  );

  const ratingKeys = useMemo(
    () => (profile ? Object.keys(profile.rating) : []),
    [profile?.rating]
  );

  const stars = useMemo(() => Array(5).fill("1"), []);

  return !isPending && profile ? (
    <View style={styles.mainContainer}>
      <View style={styles.sliderContainer}>
        <ImageSlider images={sliderImages} />
        <View style={[styles.overlayIconsHeader, { marginTop: insets.top }]}>
          <BackButton />
          <View style={styles.overlayRightIcons}>
            <BlurIconButton
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
                          vendorProfile.id ||
                          (vendorProfile as any).hotel?.id ||
                          "",
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
                          vendorProfile.id ||
                          (vendorProfile as any).hotel?.id ||
                          "",
                        ],
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
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyScrollContainer}
      >
        <View style={[styles.section, styles.sectionHPadding]}>
          <View style={styles.sectionRow}>
            <AppText font="heading4" style={{ flex: 1 }}>
              {profile.name}
            </AppText>
            <View style={styles.rightAlignRow}>
              <StarIcon
                width={16}
                height={16}
                color={theme.colors.semanticExtensions.content.contentAccent}
              />
              <AppText font="body2">{profile.averageRating.toFixed(1)}</AppText>
              <AppText font="body2">{`(${profile.totalReviews})`}</AppText>
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
              {profile.address}
            </AppText>
          </View>
          <AppText font="body1">
            {`~ £ ${profile.services[0].minSpend.toFixed(2)} min.spend`}
          </AppText>
        </View>
        <View style={styles.separator} />

        {/* Description */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Description`}</AppText>
          <AppText font="caption1">{profile.description}</AppText>
        </View>
        <View style={styles.separator} />

        {/* Amenities */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Amenities`}</AppText>
          <View style={styles.wrappedView}>
            {facilities.map((item, index) => (
              <Chip key={index.toString()} text={item.name} />
            ))}
          </View>
        </View>
        <View style={styles.separator} />

        {/* Services */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <AppText font="heading4">{`Services`}</AppText>
          <View style={{ rowGap: theme.units[3] }}>
            {services.map((item, index) => (
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
        <View style={styles.separator} />

        {/* Reviews */}
        <View style={[{ rowGap: theme.units[2] }, styles.sectionHPadding]}>
          <View style={{ columnGap: theme.units[1] }}>
            <AppText font="heading4">{`What people say`}</AppText>
            <View style={styles.leftAlignRow}>
              {stars.map((_, index) => (
                <StarIcon
                  key={index.toString()}
                  width={16}
                  height={16}
                  color={
                    theme.colors.semanticExtensions.content.contentAccent
                  }
                />
              ))}
              <AppText font="body2">{profile.averageRating.toFixed(1)}</AppText>
              <AppText font="body2">{` (${profile.totalReviews})`}</AppText>
            </View>
          </View>
          <View style={{ rowGap: theme.units[1] }}>
            {ratingKeys.map((key, keyIndex) => {
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
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ columnGap: theme.units[3] }}
          >
            {reviews.map((item, index) => (
              <MemoReviewCard key={index.toString()} review={item} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {!hideBookNow && (
        <View style={styles.actionContainer}>
          <AppButton title="Book Now" onPress={onBookNowClick} />
        </View>
      )}
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <ActivityIndicator
        size={"small"}
        color={theme.colors.semanticExtensions.content.contentAccent}
      />
    </View>
  );
};

export default BookingDetailsScreen;
