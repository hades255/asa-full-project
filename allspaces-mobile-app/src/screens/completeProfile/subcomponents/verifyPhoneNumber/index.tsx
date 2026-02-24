import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  S_VERIFY_PHONE_NUMBER_FIELDS,
  T_VERIFY_PHONE_NUMBER,
  T_VERIFY_PHONE_NUMBER_FIELDS,
} from "./types";
import { AppButton, AppOtpInput, AppText } from "@/components";
import { appColors, globalStyles } from "@/theme";
import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch, useSelector } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { RootState } from "@/redux/store";

const INITIAL_COUNTDOWN = 59;

const VerifyPhoneNumber: React.FC<T_VERIFY_PHONE_NUMBER> = ({
  flatlistIndex,
  flatlistRef,
  phoneObj,
}) => {
  const dispatch = useDispatch();
  const { verificationNumber } = useSelector(
    (state: RootState) => state.appSlice
  );
  const { user, isLoaded } = useUser();
  const [timer, setTimer] = useState(INITIAL_COUNTDOWN); // Initial countdown time
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_VERIFY_PHONE_NUMBER_FIELDS),
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
      await phoneObj?.prepareVerification();
      setTimer(INITIAL_COUNTDOWN);
      setIsDisabled(true);
      showSnackbar(`OTP has been re-sent to your mobile number.`, "success");
    } catch (error) {
      showClerkError(error);
    }
  };

  const onContinueClick = async (formData: T_VERIFY_PHONE_NUMBER_FIELDS) => {
    try {
      if (!isLoaded) return;

      dispatch(actionSetAppLoading(true));

      const phoneVerifyAttempt = await phoneObj?.attemptVerification({
        code: formData.code,
      });

      if (phoneVerifyAttempt?.verification.status === "verified") {
        flatlistRef.current?.scrollToIndex({
          index: flatlistIndex.value + 1,
          animated: true,
        });

        if (user) await user.reload();
        
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        showSnackbar(JSON.stringify(phoneVerifyAttempt, null, 2), "error");
        reset({
          code: "",
        });
      }

      dispatch(actionSetAppLoading(false));
    } catch (error) {
      showClerkError(error);
      dispatch(actionSetAppLoading(false));
      reset({
        code: "",
      });
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.bodyContainer]}>
      <View style={styles.topContainer}>
        <View style={globalStyles.screenHeadingContainer}>
          <Text
            style={globalStyles.screenHeading}
          >{`Verify Phone Number`}</Text>
          <Text style={globalStyles.screenInfo}>
            {`A six digit code is sent to your mobile `}
            <Text
              style={{ color: appColors.semantic.content.contentPrimary }}
            >{`${verificationNumber?.split("--")[0]}`}</Text>
            <Text>{`. Please write it down here`}</Text>
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {isDisabled ? (
            <Text style={globalStyles.primaryLink1}>
              {`Resend in `}
              <Text style={globalStyles.primaryLink2}>{timer}</Text>
            </Text>
          ) : (
            <Text
              onPress={resendCode}
              style={globalStyles.textLink}
            >{`Resend`}</Text>
          )}
          <AppOtpInput control={control} name="code" />
          <AppText
            font="button1"
            textAlign="center"
            style={{ textDecorationLine: "underline" }}
            textProps={{
              onPress: () => {
                flatlistRef.current?.scrollToIndex({
                  index: flatlistIndex.value - 1,
                  animated: true,
                });
              },
            }}
          >{`Change Number`}</AppText>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <AppButton
        onPress={handleSubmit(onContinueClick)}
        disabled={!isValid}
        title="Continue"
      />
    </KeyboardAwareScrollView>
  );
};

export default VerifyPhoneNumber;
