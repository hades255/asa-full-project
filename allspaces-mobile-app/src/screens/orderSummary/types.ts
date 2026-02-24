import { ERRORS } from "@/config/constants";
import * as yup from "yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookingsStackParamList } from "@/navigation/bookingsStack/types";

export type T_ORDER_SUMMARY_SCREEN = NativeStackScreenProps<
  BookingsStackParamList,
  "OrderSummaryScreen"
>;

export type T_ORDER_SUMMARY_SCREEN_ROUTE_PARAMS = {
  noOfPersons: number;
  totalPrice: number;
  bookingId: string;
  profileName: string;
  profileId: string;
  checkInDate: string;
};
