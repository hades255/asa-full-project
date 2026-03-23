import React from "react";
import { View, ViewProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type T_STACK = ViewProps & {
  direction?: "row" | "column";
  gap?: number;
};

const Stack: React.FC<T_STACK> = ({
  direction = "column",
  gap = 4,
  style,
  children,
  ...rest
}) => {
  const { theme } = useUnistyles();
  return (
    <View
      {...rest}
      style={[
        direction === "row"
          ? { flexDirection: "row", columnGap: theme.units[gap as 1] ?? gap }
          : { rowGap: theme.units[gap as 1] ?? gap },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Stack;
