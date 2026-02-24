import { HomeStackParamList } from "@/navigation/homeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";

export type T_HOME_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "HomeScreen"
>;
export type T_HOME_SCREEN_ROUTE_PARAMS = undefined;

export type BookingItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};
