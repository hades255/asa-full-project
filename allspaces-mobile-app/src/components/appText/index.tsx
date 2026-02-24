import { Text } from "react-native";
import React from "react";
import { T_APP_TEXT } from "./types";
import { useUnistyles } from "react-native-unistyles";

const AppText: React.FC<T_APP_TEXT> = ({
  children,
  style,
  textAlign = "left",
  font,
  color,
  width,
  textProps,
}) => {
  const { theme } = useUnistyles();
  return (
    <Text
      {...textProps}
      style={[
        style,
        {
          width,
          ...theme.typography[font],
          textAlign: textAlign,
          color: color ?? theme.colors.semantic.content.contentPrimary,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;
