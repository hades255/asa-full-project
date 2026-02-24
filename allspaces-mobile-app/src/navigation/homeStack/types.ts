import { T_SEARCH_RESULT_SCREEN_ROUTE_PARAMS } from "@/screens/searchResults/types";
import { T_HOME_SCREEN_ROUTE_PARAMS } from "@/screens/home/types";
import { T_SEARCH_SCREEN_ROUTE_PARAMS } from "@/screens/search/types";
import { T_BOOKING_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/bookingDetails/types";
import { T_BOOKING_ORDER_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/bookingOrderDetails/types";
import { T_PAYMENT_SCREEN_ROUTE_PARAMS } from "@/screens/paymentScreen/types";
import { T_BOOKING_ORDER_OWN_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/bookingOrderOwnDetails/types";
import { T_PAYMENT_SUCCESSFULLY_SCREEN_ROUTE_PARAMS } from "@/screens/paymentSuccessfully/types";
import { T_SEARCH_FILTERS_ROUTE_PARAMS } from "@/screens/searchFilters/types";
import { T_ACCOR_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/accorDetails/types";

export type HomeStackParamList = {
  HomeScreen: T_HOME_SCREEN_ROUTE_PARAMS;
  SearchScreen: T_SEARCH_SCREEN_ROUTE_PARAMS;
  SearchResultScreen: T_SEARCH_RESULT_SCREEN_ROUTE_PARAMS;
  BookingDetailScreen: T_BOOKING_DETAILS_SCREEN_ROUTE_PARAMS;
  BookingOrderDetailScreen: T_BOOKING_ORDER_DETAILS_SCREEN_ROUTE_PARAMS;
  BookingOrderOwnDetailScreen: T_BOOKING_ORDER_OWN_DETAILS_SCREEN_ROUTE_PARAMS;
  PaymentScreen: T_PAYMENT_SCREEN_ROUTE_PARAMS;
  PaymentSuccessfullyScreen: T_PAYMENT_SUCCESSFULLY_SCREEN_ROUTE_PARAMS;
  SearchFiltersScreen: T_SEARCH_FILTERS_ROUTE_PARAMS;
  AccorDetailScreen: T_ACCOR_DETAILS_SCREEN_ROUTE_PARAMS;
};
