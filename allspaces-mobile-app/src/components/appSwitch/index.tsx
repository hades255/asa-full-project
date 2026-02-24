import { Switch } from "react-native";
import React from "react";
import { T_APP_SWITCH } from "./types";
import { appColors } from "@/theme";
import { styles } from "./styles";

const AppSwitch: React.FC<T_APP_SWITCH> = ({ value, onValueChange, disabled = false }) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      ios_backgroundColor={appColors.semantic.background.backgroundTertionary}
      thumbColor={appColors.semantic.background.backgroundPrimary}
      trackColor={{
        true: appColors.semantic.background.backgroundInversePrimary,
        false: appColors.semantic.background.backgroundTertionary,
      }}
      style={styles.mainContainer}
    />
  );
};

export default AppSwitch;
