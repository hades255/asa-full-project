import { View, TextInput, type TextInputProps as RNTextInputProps } from "react-native";
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
import type { SharedValue } from "react-native-reanimated";

type InputFieldProps = {
  value: string;
  error?: string;
  onBlur: () => void;
  onChange: (text: string) => void;
  borderColor: SharedValue<number>;
  theme: ReturnType<typeof useUnistyles>["theme"];
  placeholder?: string;
  textContentType?: string;
  autoComplete?: string;
  isPassword?: boolean;
  name: string;
  isTextbox?: boolean;
  secureTextEntry: boolean;
  KeyboardType?: T_APP_INPUT["KeyboardType"];
  textInputProps?: T_APP_INPUT["textInputProps"];
};

const InputField = React.memo(function InputField({
  value,
  error,
  onBlur,
  onChange,
  borderColor,
  theme,
  placeholder,
  textContentType,
  autoComplete,
  isPassword,
  name,
  isTextbox,
  secureTextEntry,
  KeyboardType,
  textInputProps,
}: InputFieldProps) {
  useEffect(() => {
    const len = (value ?? "").length;
    const state = len === 0 ? 0 : error ? 2 : 3;
    borderColor.value = withTiming(state, { duration: 300 });
  }, [error, value, borderColor]);

  return (
    <TextInput
      key={isPassword ? `password-${name}` : name}
      {...textInputProps}
      placeholder={placeholder}
      placeholderTextColor={
        theme.colors.semantic.content.contentInverseTertionary
      }
      autoCapitalize="none"
      value={value ?? ""}
      textContentType={(textContentType ?? textInputProps?.textContentType) as RNTextInputProps["textContentType"]}
      autoComplete={(autoComplete ?? textInputProps?.autoComplete) as RNTextInputProps["autoComplete"]}
      importantForAutofill={isPassword ? "yes" : undefined}
      onFocus={() => {
        const len = (value ?? "").length;
        borderColor.value = withTiming(
          len === 0 ? 1 : error ? 2 : 3,
          { duration: 300 }
        );
      }}
      onBlur={() => {
        const len = (value ?? "").length;
        borderColor.value = withTiming(
          len === 0 ? 0 : error ? 2 : 3,
          { duration: 300 }
        );
        onBlur();
      }}
      onChangeText={(textValue) => {
        onChange(textValue);
        borderColor.value = withTiming(
          textValue.length === 0 ? 1 : error ? 2 : 3,
          { duration: 300 }
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
  );
});

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
  textContentType: textContentTypeProp,
  autoComplete: autoCompleteProp,
  textInputProps,
}) => {
  const textContentType = textContentTypeProp ?? (isPassword ? "password" : undefined);
  const autoComplete = autoCompleteProp ?? (isPassword ? "password" : undefined);
  const { theme } = useUnistyles();
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const borderColor = useSharedValue(0);
  const borderSelectedColor = theme.colors.semantic.border.borderSelected;
  const borderNegativeColor = theme.colors.semanticExtensions.border.borderNegative;
  const borderPositiveColor = theme.colors.semanticExtensions.border.borderPositive;

  useEffect(() => {
    setSecureTextEntry(isPassword ?? false);
  }, [isPassword]);

  const inputBorderAnimation = useAnimatedStyle(() => {
    const bColor = interpolateColor(
      borderColor.value,
      [0, 1, 2, 3],
      [
        "transparent",
        borderSelectedColor,
        borderNegativeColor,
        borderPositiveColor,
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
            <InputField
              value={value ?? ""}
              error={error}
              onBlur={onBlur}
              onChange={onChange}
              borderColor={borderColor}
              theme={theme}
              placeholder={placeholder}
              textContentType={textContentType}
              autoComplete={autoComplete}
              isPassword={isPassword}
              name={name}
              isTextbox={isTextbox}
              secureTextEntry={secureTextEntry}
              KeyboardType={KeyboardType}
              textInputProps={textInputProps}
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
