import { GestureResponderEvent } from "react-native";
import { T_PROFILE_ITEM } from "../cards/bookingCardWithReviews/types";

export type T_VENDOR_CARD = {
  profile: T_PROFILE_ITEM;
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};
