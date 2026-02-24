import { View, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { T_APP_INPUT } from "./types";
import { styles } from "./styles";
import { Eye, EyeSlash } from "iconsax-react-native";
import { Controller } from "react-hook-form";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import AppText from "../appText";
import ButtonWrapper from "../buttonWrapper";

const AppInput: React.FC<T_APP_INPUT> = ({
  width,
  icon,
  label,
  placeholder,
  isPassword,
  KeyboardType,
  control,
  name,
  error,
  isTextbox = false,
}) => {
  const { theme } = useUnistyles();
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const borderColor = useSharedValue(0);

  useEffect(() => {
    setSecureTextEntry(isPassword ? true : false);
  }, [isPassword]);

  const inputBorderAnimation = useAnimatedStyle(() => {
    const bColor = interpolateColor(
      borderColor.value,
      [0, 1, 2, 3],
      [
        "transparent",
        theme.colors.semantic.border.borderSelected,
        theme.colors.semanticExtensions.border.borderNegative,
        theme.colors.semanticExtensions.border.borderPositive,
      ]
    );
    return {
      borderColor: bColor,
      borderWidth: 1,
    };
  });

  return (
    <View style={[styles.mainContainer, { width: width ?? "100%" }]}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText font="button1">{label}</AppText>
        </View>
      )}
      <Animated.View
        style={[
          isTextbox ? styles.textboxContainer : styles.inputContainer,
          inputBorderAnimation,
        ]}
      >
        {icon}
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={
                theme.colors.semantic.content.contentInverseTertionary
              }
              autoCapitalize="none"
              value={value}
              onFocus={() => {
                borderColor.value = withTiming(
                  value.length == 0 ? 1 : error ? 2 : 3,
                  { duration: 300 }
                );
              }}
              onBlur={() => {
                borderColor.value = withTiming(
                  value.length == 0 ? 0 : error ? 2 : 3,
                  { duration: 300 }
                );
                onBlur();
              }}
              onChangeText={(textValue) => {
                onChange(textValue);
                borderColor.value = withTiming(
                  textValue.length == 0 ? 1 : error ? 2 : 3,
                  {
                    duration: 300,
                  }
                );
              }}
              multiline={isTextbox}
              textAlignVertical={isTextbox ? "top" : "center"}
              secureTextEntry={secureTextEntry}
              keyboardType={KeyboardType}
              style={[
                styles.input,
                isTextbox && {
                  height: "100%",
                  textAlignVertical: "top",
                },
              ]}
            />
          )}
        />

        {isPassword && (
          <ButtonWrapper
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            otherProps={{
              style: {
                height: "100%",
                justifyContent: "center",
              },
            }}
          >
            {secureTextEntry ? (
              <Eye
                variant="Linear"
                color={theme.colors.semantic.content.contentInverseTertionary}
                size={24}
              />
            ) : (
              <EyeSlash
                variant="Linear"
                color={theme.colors.semantic.content.contentInverseTertionary}
                size={24}
              />
            )}
          </ButtonWrapper>
        )}
      </Animated.View>
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

export default AppInput;
