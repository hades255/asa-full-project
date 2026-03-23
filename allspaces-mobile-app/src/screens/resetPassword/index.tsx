import { View } from "react-native";
import React, { useEffect, useState } from "react";

import {
  AppButton,
  AppInput,
  AppOtpInput,
  AppText,
  BackButton,
  ScreenWrapper,
} from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock1 } from "iconsax-react-native";
import { useDispatch } from "@/redux/hooks";
import { useSignIn } from "@clerk/clerk-expo";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import {
  S_RESET_PASSWORD_FIELDS,
  T_RESET_PASSWORD_FIELDS,
  T_RESET_PASSWORD_SCREEN,
} from "./types";
import { gotoLoginFromResetPassword } from "@/navigation/service";
import { useUnistyles } from "react-native-unistyles";

const INITIAL_COUNTDOWN = 59;

const ResetPassword: React.FC<T_RESET_PASSWORD_SCREEN> = ({
  navigation,
  route,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { email } = route.params;
  const [isEmailVerified, setEmailVerified] = useState<boolean>(false);
  const { isLoaded, signIn } = useSignIn();
  const [timer, setTimer] = useState(INITIAL_COUNTDOWN); // Initial countdown time
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_RESET_PASSWORD_FIELDS),
    defaultValues: {
      code: __DEV__ ? "424242" : "",
      newPassword: __DEV__ ? "JustDoIt@321" : "",
      confirmPassword: __DEV__ ? "JustDoIt@321" : "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Re-validate confirm password when newPassword changes
  useEffect(() => {
    trigger("confirmPassword");
  }, [newPassword, trigger]);

  // Show error immediately when confirmPassword has value and doesn't match
  const shouldShowConfirmPasswordError = confirmPassword && errors.confirmPassword?.message;

  // Hook for countdown
  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(false);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const resendCode = async () => {
    try {
      if (!isLoaded || !signIn) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setTimer(INITIAL_COUNTDOWN);
      setIsDisabled(true);
      showSnackbar("OTP has been re-sent to your email.", "success");
    } catch (error: any) {
      showClerkError(error);
    }
  };

  const onContinueClick = async (formData: T_RESET_PASSWORD_FIELDS) => {
    try {
      if (!isLoaded || !signIn) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }
      dispatch(actionSetAppLoading(true));

      const result = await signIn.attemptFirstFactor({
        code: formData.code,
        strategy: "reset_password_email_code",
        password: formData.newPassword,
      });

      if (result.status === "complete") {
        showSnackbar("Your password has been reset. Please sign in.", "success");
        gotoLoginFromResetPassword(navigation);
      } else {
        showSnackbar("Something went wrong. Please try again.", "error");
      }
      dispatch(actionSetAppLoading(false));
    } catch (error: any) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <BackButton />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Reset Password`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Enter OTP and new password to reset it.`}</AppText>
        </View>
        <View style={styles.otpContainer}>
          {isDisabled ? (
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
              textAlign="center"
            >
              {`Resend in `}
              <AppText
                font="button1"
                color={theme.colors.semantic.content.contentInverseTertionary}
                textAlign="center"
              >
                {timer}
              </AppText>
            </AppText>
          ) : (
            <AppText
              textProps={{ onPress: () => resendCode() }}
              font="button1"
              textAlign="center"
              style={{ textDecorationLine: "underline" }}
            >
              {`Resend`}
            </AppText>
          )}
          <AppOtpInput control={control} name="code" />
        </View>
        <View style={{ rowGap: theme.units[4] }}>
          <AppInput
            control={control}
            isPassword
            icon={
              <Lock1
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
            name="newPassword"
            label="New Password"
            placeholder="********"
            error={errors.newPassword?.message}
          />
          <AppInput
            control={control}
            isPassword
            icon={
              <Lock1
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="********"
            error={shouldShowConfirmPasswordError ? errors.confirmPassword?.message : undefined}
          />
        </View>
        <AppButton
          disabled={!isValid}
          onPress={handleSubmit(onContinueClick)}
          title="Continue"
        />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default ResetPassword;
