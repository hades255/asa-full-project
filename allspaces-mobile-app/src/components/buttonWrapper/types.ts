import React from "react";
import { GestureResponderEvent, TouchableOpacityProps } from "react-native";

export type T_BUTTON_WRAPPER = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  otherProps?: TouchableOpacityProps;
  children: React.ReactNode;
};
