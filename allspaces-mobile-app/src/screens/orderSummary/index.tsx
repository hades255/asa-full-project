import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { T_ORDER_SUMMARY_SCREEN } from "./types";
import { AppButton, AppLoader, Header2, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { formatDate, showSnackbar } from "@/utils/essentials";
import QRCode from "react-native-qrcode-svg";
import * as Calendar from "expo-calendar";
import { useGetBookingByIdQuery } from "@/apis/apiSlice";
import { horizontalScale } from "@/theme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { actionSetCalendarEventId } from "@/redux/app.slice";

const OrderSummary: React.FC<T_ORDER_SUMMARY_SCREEN> = ({
  navigation,
  route,
}) => {
  const { noOfPersons, totalPrice, bookingId, profileName, checkInDate } =
    route.params;

  const { data: bookingDetails, isLoading } = useGetBookingByIdQuery(
    bookingId || ""
  );

  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);
  const dispatch = useDispatch();
  const calendarEventIds = useSelector(
    (state: RootState) => state.appSlice.calendarEventIds
  );
  const isEventAddedToCalendar = bookingId
    ? !!calendarEventIds[bookingId]
    : false;

  useEffect(() => {
    checkCalendarPermission();
  }, []);

  const checkCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasCalendarPermission(status === "granted");
    } catch (error) {
      showSnackbar("Failed to request calendar permission", "error");
      setHasCalendarPermission(false);
    }
  };

  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasCalendarPermission(status === "granted");
      return status === "granted";
    } catch (error) {
      showSnackbar("Failed to request calendar permission", "error");
      return false;
    }
  };

  const getDefaultCalendar = async () => {
    if (!hasCalendarPermission) {
      const granted = await requestCalendarPermission();
      if (!granted) {
        Alert.alert(
          "Calendar Access Required",
          "To add events to your calendar, please enable calendar access in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return null;
      }
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );

    const defaultCalendar = calendars.find((cal) => cal.isPrimary);
    return defaultCalendar;
  };

  const addToCalendar = async () => {
    try {
      if (isEventAddedToCalendar) {
        showSnackbar("Event already added to calendar", "error");
        return;
      }
      const defaultCalendar = await getDefaultCalendar();
      if (!defaultCalendar) {
        return;
      }

      const startDate = new Date(checkInDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // next day

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Booking: ${profileName}`,
        startDate: startDate,
        endDate: endDate,
        allDay: true,
        timeZone: "UTC",
        notes: `Booking created for ${profileName}`,
        location: `${bookingDetails?.profile.location || "To be determined"}`,
      });

      if (bookingId) {
        dispatch(actionSetCalendarEventId({ bookingId, eventId }));
      }
      showSnackbar("Event added to calendar", "success");
    } catch (error) {
      console.error("Error creating calendar event:", error);
      showSnackbar("Failed to create calendar event", "error");
    }
  };

  const qrCodeValue = JSON.stringify({ bookingId: bookingId });
  return (
    <ScreenWrapper>
      <Header2 title="Order Summary" />

      <ScrollView>
        <View style={styles.qrCodeContainer}>
          <QRCode value={qrCodeValue} size={166} />
        </View>
        {/* <Image
          source={require("../../../assets/images/prefsImg/qrCode.png")}
          style={styles.qrCode}
        /> */}

        <View style={styles.mainContainer}>
          <Text style={styles.header}>Summary</Text>
          <View style={styles.divider} />

          {/* Hotel Details Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{profileName}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>No. of Persons</Text>
              <Text style={styles.value}>{noOfPersons}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.label}>No. of Hours</Text>
              <Text style={styles.value}>02</Text>
            </View> */}
            <View style={styles.row}>
              <Text style={styles.label}>Check In</Text>
              <Text style={styles.value}>{formatDate(checkInDate)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rent</Text>
              <Text style={styles.value}>${totalPrice}/night</Text>
            </View>
          </View>
          {/* <View style={styles.divider} /> */}

          {/* Gym Details Section */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Gym Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>No. of Persons</Text>
              <Text style={styles.value}>01</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>No. of Hours</Text>
              <Text style={styles.value}>02</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Check In</Text>
              <Text style={styles.value}>26/12/2024 23:00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rent</Text>
              <Text style={styles.value}>$94/hr</Text>
            </View>
          </View> */}

          <View style={styles.divider} />

          {/* Total Section */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>

          <AppButton
            // onPress={() => navigation.navigate("SearchResultScreen")}
            title="Cancel"
          />
          <View style={{ marginTop: horizontalScale(12) }}>
            <AppButton
              onPress={addToCalendar}
              title={
                isEventAddedToCalendar
                  ? "Event Already Added"
                  : "Add to Calendar"
              }
            />
          </View>
        </View>
        <AppLoader visible={isLoading} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default OrderSummary;
