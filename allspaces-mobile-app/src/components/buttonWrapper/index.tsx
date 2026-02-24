import { TouchableOpacity } from "react-native";
import React from "react";
import { T_BUTTON_WRAPPER } from "./types";

const ButtonWrapper: React.FC<T_BUTTON_WRAPPER> = ({
  onPress,
  otherProps,
  children,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

export default ButtonWrapper;
