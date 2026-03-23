import { View, Text, Alert, Platform, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import * as Calendar from "expo-calendar";
import { showSnackbar } from "@/utils/essentials";
import { SecureStoreService } from "@/config/secureStore";

export type T_EVENT = {
  eventId: string;
  bookingId: string;
};

const useCalendar = () => {
  const [syncedEvents, setSyncedEvent] = useState<T_EVENT[]>([]);

  useEffect(() => {
    SecureStoreService.getValue("SYNCED_EVENTS")
      .then((value) => {
        if (value) setSyncedEvent(JSON.parse(value));
      })
      .catch((err) => {
        console.log(`Error while getting synced events ${err}`);
      });
  }, []);

  const requestCalendarPermission = async () => {
    try {
      const { status: permissionStatus } =
        await Calendar.getCalendarPermissionsAsync();

      if (permissionStatus === Calendar.PermissionStatus.GRANTED) return true;

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === Calendar.PermissionStatus.GRANTED) return true;
      else return false;
    } catch (error) {
      showSnackbar("Calendar Permission is required to Sync Event.", "error");
      return false;
    }
  };

  const getDefaultCalendar = async () => {
    const permission = await requestCalendarPermission();
    if (!permission) {
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
              onPress: async () => {
                try {
                  await Linking.openSettings();
                } catch {
                  if (Platform.OS === "ios") {
                    await Linking.openURL("app-settings:");
                  }
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

    const defaultCalendar =
      calendars.find((cal) => cal.isPrimary) ||
      calendars.find((cal) => cal.allowsModifications) ||
      calendars[0];
    console.log(defaultCalendar);
    
    return defaultCalendar;
  };

  const addToCalendar = async (
    check_in: string,
    vendorName: string,
    location: string,
    booking_id: string
  ) => {
    try {
      const defaultCalendar = await getDefaultCalendar();
      if (!defaultCalendar) {
        return;
      }

      const startDate = new Date(check_in);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // next day

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Booking: ${vendorName}`,
        startDate: startDate,
        endDate: endDate,
        allDay: true,
        timeZone: "UTC",
        notes: `Booking created for ${vendorName}`,
        location: `${location || "To be determined"}`,
      });

      let updatedEvents = [...syncedEvents, { eventId, bookingId: booking_id }];
      setSyncedEvent(updatedEvents);
      await SecureStoreService.saveValue(
        "SYNCED_EVENTS",
        JSON.stringify(updatedEvents)
      );

      showSnackbar("Event added to calendar", "success");
    } catch (error) {
      console.error("Error creating calendar event:", error);
      showSnackbar("Failed to create calendar event", "error");
    }
  };

  const alreadySynced = (bookingId: string) => {
    return syncedEvents?.find((item) => item.bookingId === bookingId);
  };

  return { addToCalendar, syncedEvents, alreadySynced };
};

export default useCalendar;
