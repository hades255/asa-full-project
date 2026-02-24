import { T_SERVICE } from "@/apis/types";
import { GestureResponderEvent } from "react-native";
import { T_PROFILE_SERVICE } from "../cards/bookingCardWithReviews/types";

export type T_SERVICE_CARD = {
  service: T_PROFILE_SERVICE;
  isSelected?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};
