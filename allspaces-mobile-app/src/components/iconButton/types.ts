import React from "react";
import { GestureResponderEvent } from "react-native";

export type T_ICON_BUTTON = {
  icon: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};
