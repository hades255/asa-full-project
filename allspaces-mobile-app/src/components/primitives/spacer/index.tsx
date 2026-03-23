import React from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type T_SPACER = {
  size?: number;
  horizontal?: boolean;
  flex?: boolean;
};

const Spacer: React.FC<T_SPACER> = ({ size = 4, horizontal = false, flex }) => {
  const { theme } = useUnistyles();
  if (flex) {
    return <View style={{ flex: 1 }} />;
  }
  const measuredSize = theme.units[size as 1] ?? size;
  return (
    <View style={horizontal ? { width: measuredSize } : { height: measuredSize }} />
  );
};

export default Spacer;
