import { GestureResponderEvent } from "react-native";
import { T_BOOKING_ITEM } from "@/apis/types";

export type T_BOOKING_CARD = {
  booking: T_BOOKING_ITEM;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onScanPress?: ((event: GestureResponderEvent) => void) | undefined;
};
