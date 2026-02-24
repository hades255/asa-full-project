import React from "react";
import { T_APP_OTP_INPUT } from "./types";
import { Controller } from "react-hook-form";
import { OtpInput } from "react-native-otp-entry";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";

const AppOtpInput: React.FC<T_APP_OTP_INPUT> = ({ name, control }) => {
  const { theme } = useUnistyles();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <OtpInput
          numberOfDigits={6}
          focusColor={theme.colors.semantic.border.borderSelected}
          autoFocus={true}
          blurOnFilled={true}
          type="alphanumeric"
          focusStickBlinkingDuration={500}
          onTextChange={onChange}
          onBlur={onBlur}
          theme={{
            containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          }}
        />
      )}
    />
  );
};

export default AppOtpInput;
