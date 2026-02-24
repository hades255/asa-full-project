import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import React from "react";

import {
  AppButton,
  AppText,
  Header2,
  ScreenWrapper,
  ServiceCard,
  VendorCard,
} from "@/components";
import { styles } from "./styles";
import { T_SCAN_DETAILS_SCREEN } from "./types";

import QRCode from "react-native-qrcode-svg";
import { useUnistyles } from "react-native-unistyles";
import moment from "moment";
import {
  API_ROUTES,
  useGetBookingById,
  useStartBookingByID,
  useUpdateBookingStatusAPI,
} from "@/apis";
import Rating from "react-native-star-rating-widget";
import { showSnackbar } from "@/utils/essentials";
import {
  FacebookIcon,
  GoogleIcon,
  InstaIcon,
  LinkedInIcon,
  StarIcon,
} from "assets/icons";
import { useQueryClient } from "@tanstack/react-query";

const ScanDetails: React.FC<T_SCAN_DETAILS_SCREEN> = ({
  navigation,
  route,
}) => {
  const { scanResult } = route.params;
  console.log("scanResult", scanResult);

  const {
    data: booking,
    isPending,
    isRefetching,
    refetch,
    isError,
  } = useGetBookingById(scanResult.data);
  const { theme } = useUnistyles();
  const { mutateAsync: startBooking, isPending: startLoading } =
    useStartBookingByID();
  const queryClient = useQueryClient();
  if (isError) {
    showSnackbar(`There is not booking available against this ID.`, "error");
    navigation.goBack();
    return;
  }

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Details" />
      <View style={styles.mainContainer}>
        {!isPending && booking ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainScrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[theme.colors.core.accent]}
                tintColor={theme.colors.core.accent}
              />
            }
          >
            <View style={styles.qrContainer}>
              <QRCode
                color={theme.colors.semantic.content.contentPrimary}
                size={124}
                value={booking.id}
              />
            </View>

            <View style={{ rowGap: theme.units[3] }}>
              <AppText font="button1">{`Status`}</AppText>
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor:
                      booking.status == "PENDING"
                        ? theme.colors.semanticExtensions.background
                            .backgroundWarning
                        : booking.status == "APPROVED"
                        ? theme.colors.semanticExtensions.background
                            .backgroundAccent
                        : booking.status == "COMPLETED"
                        ? theme.colors.semanticExtensions.background
                            .backgroundPositive
                        : booking.status == "IN_PROGRESS"
                        ? theme.colors.semanticExtensions.background
                            .backgroundAccent
                        : theme.colors.semanticExtensions.background
                            .backgroundNegative,
                  },
                ]}
              >
                <AppText
                  font="body1"
                  color={theme.colors.semantic.content.contentInversePrimary}
                >
                  {booking.status}
                </AppText>
              </View>

              {booking.isReviewed && (
                <>
                  <View style={styles.seperator} />
                  <View style={{ rowGap: theme.units[3] }}>
                    <AppText font="button1">{`Review`}</AppText>
                    <View style={{ rowGap: theme.units[1] }}>
                      <Rating
                        starSize={16}
                        rating={booking.reviews[0].rating}
                        onChange={() => {}}
                        emptyColor={
                          theme.colors.semantic.background.backgroundSecondary
                        }
                        color={
                          theme.colors.semanticExtensions.content.contentAccent
                        }
                      />
                      <AppText
                        font="body2"
                        textAlign="left"
                      >{`${booking.reviews[0].comment}`}</AppText>
                    </View>
                  </View>
                </>
              )}

              {booking.status === "CANCELLED" && (
                <>
                  <View style={styles.seperator} />
                  <View style={{ rowGap: theme.units[3] }}>
                    <AppText font="button1">{`Cancel Reason`}</AppText>
                    <View style={{ rowGap: theme.units[1] }}>
                      <AppText
                        font="body2"
                        textAlign="left"
                      >{`${booking.cancellationReason}`}</AppText>
                    </View>
                  </View>
                </>
              )}

              {/* Customer Data */}
              <View style={styles.seperator} />
              <AppText font="button1">{`Customer`}</AppText>
              <View style={{ rowGap: theme.units[2] }}>
                <View style={styles.row}>
                  <AppText font="body2" textAlign="left">{`Name`}</AppText>
                  <AppText
                    font="body2"
                    textAlign="right"
                  >{`${`${booking.customer?.clerkCustomerData.first_name} ${booking.customer.clerkCustomerData?.last_name}`}`}</AppText>
                </View>
                <View style={styles.row}>
                  <AppText font="body2" textAlign="left">{`Email`}</AppText>
                  <AppText
                    font="body2"
                    textAlign="right"
                  >{`${booking.customer.clerkCustomerData?.email_addresses[0].email_address}`}</AppText>
                </View>
                <View style={styles.row}>
                  <AppText font="body2" textAlign="left">{`Phone`}</AppText>
                  <AppText
                    font="body2"
                    textAlign="right"
                  >{`${booking.customer.clerkCustomerData?.phone_numbers[0].phone_number}`}</AppText>
                </View>
                <View style={styles.row}>
                  <AppText
                    font="body2"
                    textAlign="left"
                  >{`Social Accounts`}</AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: theme.units[2],
                    }}
                  >
                    {booking.customer.clerkCustomerData?.external_accounts.map(
                      (item: any) => {
                        return item.object.toLowerCase().includes("google") ? (
                          <GoogleIcon
                            key={item.object}
                            width={24}
                            height={24}
                          />
                        ) : item.object.toLowerCase().includes("facebook") ? (
                          <FacebookIcon
                            key={item.object}
                            width={24}
                            height={24}
                          />
                        ) : item.object.toLowerCase().includes("instagram") ? (
                          <InstaIcon key={item.object} width={24} height={24} />
                        ) : (
                          <LinkedInIcon
                            key={item.object}
                            width={24}
                            height={24}
                          />
                        );
                      }
                    )}
                  </View>
                </View>
                <View style={styles.row}>
                  <AppText font="body2" textAlign="left">{`Rating`}</AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: theme.units[1],
                      justifyContent: "flex-end",
                    }}
                  >
                    <StarIcon
                      width={16}
                      height={16}
                      color={
                        theme.colors.semanticExtensions.content.contentAccent
                      }
                    />
                    <AppText
                      font="body2"
                      textAlign="right"
                    >{`${booking.customer.averageRating.toFixed(1)} (${
                      booking.customer.reviewsCount
                    })`}</AppText>
                  </View>
                </View>
              </View>

              <View style={styles.seperator} />
              <AppText font="button1">{`Summary`}</AppText>
              <View style={{ rowGap: theme.units[2] }}>
                <View style={styles.row}>
                  <AppText
                    font="body2"
                    textAlign="left"
                  >{`No. of Guests`}</AppText>
                  <AppText
                    font="body2"
                    textAlign="right"
                  >{`Host + ${booking.no_of_guests}`}</AppText>
                </View>
                <View style={styles.row}>
                  <AppText
                    font="body2"
                    textAlign="left"
                  >{`Time & Date`}</AppText>
                  <AppText font="body2" textAlign="right">{`${moment(
                    booking.check_in
                  ).format("DD MMM YYYY")}`}</AppText>
                </View>
                <View style={styles.row}>
                  <AppText font="body2" textAlign="left">{`Location`}</AppText>
                  <AppText
                    font="body2"
                    textAlign="right"
                  >{`${booking.address}`}</AppText>
                </View>
              </View>

              <View style={styles.seperator} />
              <AppText font="button1">{`Space`}</AppText>
              <VendorCard
                profile={booking.profile}
                disabled={true}
                onPress={() => {
                  navigation.getParent()?.navigate("HomeStack", {
                    screen: "BookingDetailScreen",
                    params: { profile: booking.profile },
                  });
                }}
              />
              <View style={styles.seperator} />
              <AppText font="button1">{`Services`}</AppText>
              <View style={{ rowGap: theme.units[2] }}>
                {booking.bookingServices.map((item) => (
                  <ServiceCard key={item.id} service={item} />
                ))}
              </View>
              <View style={styles.seperator} />

              <View style={styles.row}>
                <AppText font="button1">{`Total`}</AppText>
                <AppText
                  font="heading4"
                  color={theme.colors.semanticExtensions.content.contentAccent}
                >{`$ ${booking.amount.toFixed(2)}`}</AppText>
              </View>

              {booking.status === "APPROVED" && (
                <AppButton
                  title="Start Booking"
                  disabled={startLoading}
                  onPress={async () => {
                    try {
                      await startBooking({ id: booking.id });
                      queryClient.invalidateQueries({
                        queryKey: [API_ROUTES.GET_BOOKINGS_BY_ID],
                      });

                      showSnackbar("Booking started successfully", "success");
                    } catch (error) {
                      console.log("error", error);
                      showSnackbar(JSON.stringify(error), "error");
                    }
                  }}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="small"
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default ScanDetails;
