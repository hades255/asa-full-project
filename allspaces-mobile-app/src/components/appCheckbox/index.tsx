import { View } from "react-native";
import React from "react";
import { T_APP_CHECKBOX } from "./types";
import Checkbox from "expo-checkbox";
import { styles } from "./styles";
import { Controller } from "react-hook-form";
import { useUnistyles } from "react-native-unistyles";
import AppText from "../appText";

const AppCheckbox: React.FC<T_APP_CHECKBOX> = ({
  message,
  control,
  name,
  textComponent,
  error,
}) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mainContainer,
          { alignItems: textComponent ? "flex-start" : "center" },
        ]}
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <Checkbox
              value={value}
              onValueChange={onChange}
              color={theme.colors.semanticExtensions.content.contentAccent}
              style={[
                styles.checkbox,
                { marginTop: textComponent ? theme.units[1] : 0 },
              ]}
            />
          )}
        />

        {textComponent
          ? textComponent
          : message && <AppText font="body1">{message}</AppText>}
        {}
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <AppText
            font="caption1"
            color={theme.colors.semanticExtensions.content.contentNegative}
          >
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};

export default AppCheckbox;
