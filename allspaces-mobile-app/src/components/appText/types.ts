import React from "react";
import { DimensionValue, StyleProp, TextProps, TextStyle } from "react-native";

export type T_APP_TEXT = {
  children: React.ReactNode;
  textAlign?: "auto" | "justify" | "left" | "right" | "center";
  font:
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "body1"
    | "body2"
    | "body3"
    | "caption1"
    | "caption2"
    | "button1"
    | "button2";
  style?: StyleProp<TextStyle>;
  color?: string;
  width?: DimensionValue;
  textProps?: TextProps;
};
