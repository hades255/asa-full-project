import { GestureResponderEvent } from "react-native";

export type T_CHIP = {
  text: string;
  isSelected?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};
