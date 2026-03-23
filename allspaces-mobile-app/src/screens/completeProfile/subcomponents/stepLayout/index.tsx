import { View } from "react-native";
import React from "react";
import { useUnistyles } from "react-native-unistyles";

type T_STEP_LAYOUT = {
  children: React.ReactNode;
};

const StepLayout: React.FC<T_STEP_LAYOUT> = ({ children }) => {
  const { theme } = useUnistyles();
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingHorizontal: theme.units[4],
      }}
    >
      {children}
    </View>
  );
};

export default StepLayout;
