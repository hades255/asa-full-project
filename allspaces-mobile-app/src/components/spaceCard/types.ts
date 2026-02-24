import { GestureResponderEvent } from "react-native";
import { T_PROFILE_ITEM } from "../cards/bookingCardWithReviews/types";

export type T_SPACE_CARD = {
  space: T_PROFILE_ITEM;
  fullWidth?: boolean;
  isBooked?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onScanPress?: ((event: GestureResponderEvent) => void) | undefined
};
