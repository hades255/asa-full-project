import { View } from "react-native";
import React, { useCallback, useState } from "react";

import {
  AppButton,
  AppInput,
  AppLoader,
  AppText,
  Header2,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { S_RATE_BOOKING_FIELDS, T_RATE_BOOKING_SCREEN } from "./types";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUnistyles } from "react-native-unistyles";
import { API_ROUTES, useRateBookingAPI } from "@/apis";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useQueryClient } from "@tanstack/react-query";
import StarRating from "react-native-star-rating-widget";

const RateBooking: React.FC<T_RATE_BOOKING_SCREEN> = ({
  navigation,
  route,
}) => {
  const { theme } = useUnistyles();
  const { bookingId, profileId } = route.params;
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();
  const handleChange = useCallback(
    (value: number) => setRating(Math.round(value)),
    []
  );

  const { mutateAsync: rateBookingAPI, isPending: rateBookingAPILoading } =
    useRateBookingAPI();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_RATE_BOOKING_FIELDS),
    defaultValues: {
      comment: "",
    },
  });

  const submitRating = async (data: any) => {
    try {
      await rateBookingAPI({
        bookingId: bookingId,
        profileId: profileId,
        rating: rating,
        comment: data.comment,
      });
      showSnackbar("Rating is submitted successfully.");
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.GET_BOOKINGS],
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "BookingsScreen" }],
      });
    } catch (error) {
      showClerkError(error);
    }
  };

  const handleRating = (rating: number) => {
    setRating(Math.round(rating));
  };

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Give Rating" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        keyboardShouldPersistTaps="never"
      >
        <View style={styles.ratingContainer}>
          <AppText font="button1">{`Rating`}</AppText>
          <StarRating
            rating={rating}
            onChange={handleRating}
            emptyColor={
              theme.colors.semantic.background.backgroundInversePrimary
            }
            color={theme.colors.semanticExtensions.content.contentAccent}
            starSize={32}
          />
        </View>
        <AppInput
          name="comment"
          control={control}
          error={errors.comment?.message}
          label={`Comment`}
          isTextbox
          placeholder={`Write comments here...`}
        />
        <View style={{ flex: 1 }} />
        <AppButton onPress={handleSubmit(submitRating)} title="Submit" />
      </KeyboardAwareScrollView>
      <AppLoader visible={rateBookingAPILoading} />
    </ScreenWrapper>
  );
};

export default RateBooking;
