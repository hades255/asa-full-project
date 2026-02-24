import { ERRORS } from "@/config/constants";
import * as yup from "yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/homeStack/types";
import { T_GET_PROFILE_ITEM } from "@/apis/types";
import {
  T_PROFILE_ITEM,
  T_PROFILE_SERVICE,
} from "@/components/cards/bookingCardWithReviews/types";

export type T_BOOKING_ORDER_DETAILS_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "BookingOrderDetailScreen"
>;

export type T_BOOKING_ORDER_DETAILS_SCREEN_ROUTE_PARAMS = {
  profile: T_PROFILE_ITEM;
  services: T_PROFILE_SERVICE[];
};

export const BOOKING_INFO_FIELDS = yup
  .object({
    time: yup.string().required(ERRORS.time),
    date: yup.date().required(ERRORS.date),
    noOfPersons: yup.string().required(ERRORS.noOfPersons),
  })
  .required();

export type T_BOOKING_INFO_FIELDS = yup.InferType<typeof BOOKING_INFO_FIELDS>;
