import React from "react";
import { DimensionValue, GestureResponderEvent } from "react-native";

export type T_APP_BUTTON = {
  width?: DimensionValue;
  title: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "text-btn";
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  disabled?: boolean;
  size?: "default" | "small";
};
