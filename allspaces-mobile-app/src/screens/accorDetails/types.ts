import { T_ACCOR_ITEM } from "@/apis/types";
import { HomeStackParamList } from "@/navigation/homeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_ACCOR_DETAILS_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "AccorDetailScreen"
>;
export type T_ACCOR_DETAILS_SCREEN_ROUTE_PARAMS = {
  profile: T_ACCOR_ITEM;
};
