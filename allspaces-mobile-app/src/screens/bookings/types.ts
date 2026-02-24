import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";
import { BookingsStackParamList } from "@/navigation/bookingsStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_BOOKINGS_SCREEN = NativeStackScreenProps<
  BookingsStackParamList,
  "BookingsScreen"
>;
export type T_BOOKINGS_SCREEN_ROUTE_PARAMS = undefined;

export type T_BOOKING_ITEM = {
  id: string;
  check_in: string;
  created_at: string;
  customerId: string;
  isReviewed: boolean;
  no_of_guests: number;
  profileId: string;
  spend: number;
  status: string;
  time: string;
  total_hours: number;
  updated_at: string;
  user: {
    email: string;
    first_name: string | null;
    id: string;
    last_name: string | null;
    phone: string | null;
  };
  userId: string;
  profile: T_PROFILE_ITEM;
};
