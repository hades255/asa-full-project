import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookingsStackParamList } from "@/navigation/bookingsStack/types";
import { T_BOOKING_ITEM } from "@/apis/types";

export type T_ORDER_DETAILS_SCREEN = NativeStackScreenProps<
  BookingsStackParamList,
  "OrderDetailsScreen"
>;

export type T_ORDER_DETAILS_SCREEN_ROUTE_PARAMS = {
  booking: T_BOOKING_ITEM;
};
