import { T_BOOKINGS_SCREEN_ROUTE_PARAMS } from "@/screens/bookings/types";
import { T_OFFER_SCREEN_ROUTE_PARAMS } from "@/screens/offer/types";
import { T_ORDER_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/orderDetails/types";
import { T_ORDER_SUMMARY_SCREEN_ROUTE_PARAMS } from "@/screens/orderSummary/types";
import { T_RATE_BOOKING_SCREEN_ROUTE_PARAMS } from "@/screens/rateBooking/types";

export type BookingsStackParamList = {
  BookingsScreen: T_BOOKINGS_SCREEN_ROUTE_PARAMS;
  OrderSummaryScreen: T_ORDER_SUMMARY_SCREEN_ROUTE_PARAMS;
  OrderDetailsScreen: T_ORDER_DETAILS_SCREEN_ROUTE_PARAMS;
  OfferScreen: T_OFFER_SCREEN_ROUTE_PARAMS;
  RateBookingScreen: T_RATE_BOOKING_SCREEN_ROUTE_PARAMS;
};
