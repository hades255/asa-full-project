import { ScrollView, View } from "react-native";
import React from "react";

import { T_BOOKING_ORDER_DETAILS_SCREEN } from "./types";
import {
  AppButton,
  AppLoader,
  AppText,
  Header2,
  ScreenWrapper,
  ServiceCard,
  VendorCard,
} from "@/components";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";
import moment from "moment";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch, useSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  API_ROUTES,
  useCreateBookingAPI,
  useCreatePaymentIntent,
} from "@/apis";
import { STRIPE_RETURN_URL } from "@/config/constants";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useUser } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";

const BookingOrderDetails: React.FC<T_BOOKING_ORDER_DETAILS_SCREEN> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { searchData, googlePlaceData } = useSelector(
    (state: RootState) => state.appSlice
  );
  const queryClient = useQueryClient();
  const { profile, services } = route.params;
  const { theme } = useUnistyles();
  const { mutateAsync: createBookingAPI, isPending: createBookingLoading } =
    useCreateBookingAPI();
  const {
    mutateAsync: createPaymentIntentAPI,
    isPending: paymentIntentLoading,
  } = useCreatePaymentIntent();

  let total = 0;
  services.forEach((service) => {
    total += service.minSpend;
  });
  if (searchData == null) return;

  total = total * (searchData.noOfGuests + 1);

  const onConfirmClick = async () => {
    try {
      if (!googlePlaceData || !user) return;

      let details = {
        profile_id: profile.id,
        check_in: searchData.date,
        no_of_guests: searchData.noOfGuests,
        duration: searchData.duration,
        source: "SPACE",
        serviceIds: services.map((item) => item.id),
        location: {
          lat: googlePlaceData.geometry.location.lat,
          lng: googlePlaceData.geometry.location.lng,
        },
        address: googlePlaceData.formatted_address,
      };

      const response = await createBookingAPI(details);

      console.log("response", response);

      const intentResponse = await createPaymentIntentAPI({
        booking_id: response.booking.id,
      });

      console.log("intentResponse", intentResponse);

      setTimeout(async () => {
        const { error, paymentOption } = await initPaymentSheet({
          merchantDisplayName: "All Spaces",
          returnURL: STRIPE_RETURN_URL,
          customerId: intentResponse.customerId,
          customerEphemeralKeySecret: intentResponse.customerEphemeralKeySecret,
          paymentIntentClientSecret: intentResponse.paymentIntentClientSecret,
          defaultBillingDetails: {
            email: user?.primaryEmailAddress?.emailAddress,
            phone: user?.primaryPhoneNumber?.phoneNumber,
            name: `${user.firstName} ${user.lastName}`,
          },
        });

        if (error) {
          showSnackbar(
            `Something went wrong while setting up payment intent`,
            "error"
          );
          return;
        }

        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          showSnackbar(`Something went wrong while presenting intent`, "error");
          return;
        } else {
          showSnackbar(`Your Booking is created successfully!`, "success");
        }

        navigation.navigate("PaymentSuccessfullyScreen");
        queryClient.invalidateQueries({
          queryKey: [API_ROUTES.GET_BOOKINGS],
        });
      }, 1000);
    } catch (error) {
      showClerkError(error);
    }
  };

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Confirm Booking" />
      <View style={styles.mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScrollContainer}
        >
          <View style={{ rowGap: theme.units[3] }}>
            <AppText font="button1">{`Summary`}</AppText>
            <View style={{ rowGap: theme.units[3] }}>
              <View style={styles.row}>
                <AppText font="body2">{`No. of Guests`}</AppText>
                <AppText font="body2" textAlign="right">
                  {`Host + ${searchData.noOfGuests}`}
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText font="body2">{`Duration`}</AppText>
                <AppText font="body2" textAlign="right">
                  {searchData.duration} hrs
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText font="body2">{`Time & Date`}</AppText>
                <AppText font="body2" textAlign="right">
                  {moment(searchData.date).format("DD MMM YYYY")}
                </AppText>
              </View>
              <View style={styles.row}>
                <AppText font="body2">{`Location`}</AppText>
                <AppText font="body2" textAlign="right">
                  {searchData.location}
                </AppText>
              </View>
            </View>
            <View style={styles.separator} />
            <AppText font="button1">{`Space`}</AppText>
            <VendorCard profile={profile} />
            <View style={styles.separator} />
            <AppText font="button1">{`Services`}</AppText>
            {services.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
            <View style={styles.separator} />
            <View style={styles.row}>
              <AppText font="button1">{`Total`}</AppText>
              <AppText
                font="heading4"
                textAlign="right"
                color={theme.colors.semanticExtensions.content.contentAccent}
              >{`£ ${total.toFixed(2)}`}</AppText>
            </View>
          </View>
        </ScrollView>
        <AppButton title="Confirm Booking" onPress={onConfirmClick} />
      </View>
      <AppLoader visible={createBookingLoading} />
    </ScreenWrapper>
  );
};

export default BookingOrderDetails;
