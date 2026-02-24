import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookingsStackParamList } from "./types";
import { Bookings } from "@/screens";
import BookingOrderDetails from "@/screens/bookingOrderDetails";
import OrderSummary from "@/screens/orderSummary";
import OrderDetails from "@/screens/orderDetails";
import Offer from "@/screens/offer";
import RateBooking from "@/screens/rateBooking";

const Stack = createNativeStackNavigator<BookingsStackParamList>();

const BookingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"BookingsScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="BookingsScreen" component={Bookings} />
      <Stack.Screen name="OrderSummaryScreen" component={OrderSummary} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetails} />
      <Stack.Screen name="OfferScreen" component={Offer} />
      <Stack.Screen name="RateBookingScreen" component={RateBooking} />
    </Stack.Navigator>
  );
};

export default BookingsStack;
