import { T_ACCOR_ITEM } from "@/apis/types";
import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";
import { HomeStackParamList } from "@/navigation/homeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { type ImageStyle, type StyleProp } from "react-native";

export type T_BOOKING_DETAILS_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "BookingDetailScreen"
>;
export type T_BOOKING_DETAILS_SCREEN_ROUTE_PARAMS = {
  profile: T_PROFILE_ITEM | T_ACCOR_ITEM;
  hideBookNow?: boolean;
};

export type Options = {
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
};
