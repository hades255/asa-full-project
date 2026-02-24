import { T_ACCOR_ITEM } from "@/apis/types";
import { GestureResponderEvent } from "react-native";

export type T_ACCOR_CARD = {
  item: T_ACCOR_ITEM;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};
