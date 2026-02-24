import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookingsStackParamList } from "@/navigation/bookingsStack/types";
import * as yup from "yup";

export type T_RATE_BOOKING_SCREEN = NativeStackScreenProps<
  BookingsStackParamList,
  "RateBookingScreen"
>;

export type T_RATE_BOOKING_SCREEN_ROUTE_PARAMS = {
  bookingId: string;
  profileId: string;
};

export const S_RATE_BOOKING_FIELDS = yup.object().shape({
  comment: yup.string().required("Comment is required"),
});
