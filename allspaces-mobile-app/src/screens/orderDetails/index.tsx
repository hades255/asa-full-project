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
import { T_ORDER_DETAILS_SCREEN } from "./types";
import { gotoRateBookingFromOrderDetails } from "@/navigation/service";

import QRCode from "react-native-qrcode-svg";
import { useUnistyles } from "react-native-unistyles";
import moment from "moment";
import { useGetBookingById } from "@/apis";
import useCalendar from "@/hooks/useCalendar";
import Rating from "react-native-star-rating-widget";

const OrderDetails: React.FC<T_ORDER_DETAILS_SCREEN> = ({
  navigation,
  route,
}) => {
  const { booking: bookingData } = route.params;
  const {
    data: booking,
    isPending,
    isRefetching,
    refetch,
  } = useGetBookingById(bookingData.id);
  const { theme } = useUnistyles();

  const { addToCalendar, alreadySynced } = useCalendar();

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
                        ? theme.colors.semantic.background
                            .backgroundInversePrimary
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
                        onChange={() => {}}
                        rating={booking.reviews[0].rating}
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

              {booking.status === "CANCELLED" && booking.cancellationReason && (
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
              <VendorCard profile={booking.profile} />
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
                >{`£ ${booking.amount.toFixed(2)}`}</AppText>
              </View>
            </View>

            <View style={{ rowGap: theme.units[3], marginTop: 72 }}>
              {booking.status === "APPROVED" && !alreadySynced(booking.id) && (
                <AppButton
                  title="Sync With Calendar"
                  onPress={async () => {
                    await addToCalendar(
                      booking.check_in,
                      booking.profile.name,
                      booking.address,
                      booking.id
                    );
                  }}
                />
              )}
              {booking.status === "COMPLETED" && !booking.isReviewed && (
                <AppButton
                  title="Give Rating"
                  onPress={() => {
                    gotoRateBookingFromOrderDetails(navigation, {
                      bookingId: booking.id,
                      profileId: booking.profile.id,
                    });
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

export default OrderDetails;
