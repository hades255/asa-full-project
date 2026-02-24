import { HomeStackParamList } from "@/navigation/homeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_PAYMENT_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "PaymentScreen"
>;
export type T_PAYMENT_SCREEN_ROUTE_PARAMS = {
  profileId: string;
  noOfPersons: string;
  totalAmount: string;
  date: string;
  time: string;
  source: string;
};
