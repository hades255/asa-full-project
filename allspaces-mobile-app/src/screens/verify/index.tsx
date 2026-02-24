import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { S_VERIFY_FIELDS, T_VERIFY_FIELDS, T_VERIFY_SCREEN } from "./types";
import {
  AppButton,
  AppOtpInput,
  AppText,
  BackButton,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { gotoAccountSuccessFromVerify } from "@/navigation/service";
import { useAuth, useSignUp, useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch } from "react-redux";
import {
  actionSetAppLoading,
  actionSetCreatedSessionId,
} from "@/redux/app.slice";
import { SecureStoreService } from "@/config/secureStore";
import { useUnistyles } from "react-native-unistyles";
import { useRegisterUserAPI } from "@/apis";

const INITIAL_COUNTDOWN = 30;

const Verify: React.FC<T_VERIFY_SCREEN> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { credential, type } = route.params;
  const { signUp, isLoaded } = useSignUp();
  const { signOut } = useAuth();

  const [timer, setTimer] = useState(INITIAL_COUNTDOWN); // Initial countdown time
  const [isDisabled, setIsDisabled] = useState(true);
  const { mutateAsync: registerClerkUser, error } = useRegisterUserAPI();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_VERIFY_FIELDS),
    defaultValues: {
      code: "",
    },
  });

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
      if (!isLoaded) return;
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setTimer(INITIAL_COUNTDOWN);
      setIsDisabled(true);
      showSnackbar(`OTP has been re-sent to your ${type}.`, "success");
    } catch (error) {
      showClerkError(error);
    }
  };

  const onContinueClick = async (formData: T_VERIFY_FIELDS) => {
    try {
      if (!isLoaded) return;

      dispatch(actionSetAppLoading(true));

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: formData.code,
      });

      if (signUpAttempt.status === "complete" && signUpAttempt.createdUserId) {
        dispatch(actionSetCreatedSessionId(signUpAttempt.createdSessionId));
        await registerClerkUser({
          clerk_user_id: signUpAttempt.createdUserId,
        });
        if (signUpAttempt.createdSessionId)
          await SecureStoreService.saveValue(
            "SESSION_ID",
            signUpAttempt.createdSessionId
          );
        gotoAccountSuccessFromVerify(navigation);
        showSnackbar(`Email has been verified successfully.`, "success");
      } else {
        showSnackbar(JSON.stringify(signUpAttempt, null, 2), "error");
        console.error();
      }

      dispatch(actionSetAppLoading(false));
    } catch (error) {
      await signOut();
      console.log("error", JSON.stringify(error));

      showClerkError(error);
      dispatch(actionSetAppLoading(false));
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
        <BackButton />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Verify Email`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >
            {`A six digit code is sent to your ${type} `}
            <AppText
              font="button1"
              color={theme.colors.semantic.content.contentPrimary}
            >
              {credential}
            </AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >{`. Please write it down here`}</AppText>
          </AppText>
        </View>
        <View style={styles.otpContainer}>
          {isDisabled ? (
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >
              {`Resend in `}
              <AppText font="button1">{`${timer}`}</AppText>
            </AppText>
          ) : (
            <AppText
              textProps={{
                onPress: () => resendCode(),
              }}
              font="button1"
              style={{ textDecorationLine: "underline" }}
            >
              {`Resend`}
            </AppText>
          )}
          <AppOtpInput control={control} name="code" />
        </View>
        <AppButton
          onPress={handleSubmit(onContinueClick)}
          disabled={!isValid}
          title="Continue"
        />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default Verify;
