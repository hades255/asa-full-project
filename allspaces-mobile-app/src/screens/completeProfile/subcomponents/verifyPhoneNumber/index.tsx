import { Keyboard, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  S_VERIFY_PHONE_NUMBER_FIELDS,
  T_VERIFY_PHONE_NUMBER,
  T_VERIFY_PHONE_NUMBER_FIELDS,
} from "./types";
import { AppButton, AppOtpInput, AppText } from "@/components";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch, useSelector } from "@/redux/hooks";
import { actionSetAppLoading } from "@/redux/app.slice";
import { RootState } from "@/redux/store";
import StepLayout from "../stepLayout";

const INITIAL_COUNTDOWN = 59;

const VerifyPhoneNumber: React.FC<T_VERIFY_PHONE_NUMBER> = ({
  phoneObj,
  onNext,
  onPrev,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { verificationNumber } = useSelector(
    (state: RootState) => state.appSlice
  );
  const { user, isLoaded } = useUser();
  const [timer, setTimer] = useState(INITIAL_COUNTDOWN);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isResending, setResending] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(false);
      return;
    }
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const resendCode = async () => {
    if (!isLoaded || isResending) return;
    try {
      setResending(true);
      await phoneObj?.prepareVerification();
      if (isMountedRef.current) {
        setTimer(INITIAL_COUNTDOWN);
        setIsDisabled(true);
        showSnackbar(`OTP has been re-sent to your mobile number.`, "success");
      }
    } catch (error) {
      showClerkError(error);
    } finally {
      if (isMountedRef.current) setResending(false);
    }
  };

  const onContinueClick = async (formData: T_VERIFY_PHONE_NUMBER_FIELDS) => {
    if (!isLoaded || isSubmitting) return;
    try {
      setSubmitting(true);
      dispatch(actionSetAppLoading(true));

      const phoneVerifyAttempt = await phoneObj?.attemptVerification({
        code: formData.code,
      });

      if (!isMountedRef.current) return;

      if (phoneVerifyAttempt?.verification.status === "verified") {
        Keyboard.dismiss();
        if (user) await user.reload();
        onNext();
      } else {
        showSnackbar(JSON.stringify(phoneVerifyAttempt, null, 2), "error");
        reset({ code: "" });
      }
    } catch (error) {
      showClerkError(error);
      if (isMountedRef.current) reset({ code: "" });
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
        dispatch(actionSetAppLoading(false));
      }
    }
  };

  return (
    <StepLayout>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.bodyContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topContainer}>
          <View style={{ rowGap: theme.units[1] }}>
            <AppText font="heading2">{`Verify Phone Number`}</AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >
              {`A six digit code is sent to your mobile `}
              <AppText font="body1" color={theme.colors.semantic.content.contentPrimary}>
                {`${verificationNumber?.split("--")[0]}`}
              </AppText>
              {`. Please write it down here`}
            </AppText>
          </View>
          <View style={styles.otpContainer}>
            {isDisabled ? (
              <AppText font="body1" color={theme.colors.semantic.content.contentPrimary}>
                {`Resend in `}
                <AppText font="button1" color={theme.colors.semantic.content.contentPrimary}>
                  {timer}
                </AppText>
              </AppText>
            ) : (
              <AppText
                font="body1"
                style={{ textDecorationLine: "underline", opacity: isResending ? 0.6 : 1 }}
                textProps={{ onPress: isResending ? undefined : resendCode }}
              >{`Resend`}</AppText>
            )}
            <AppOtpInput control={control} name="code" />
            <AppText
              font="button1"
              textAlign="center"
              style={{ textDecorationLine: "underline" }}
              textProps={{ onPress: onPrev }}
            >{`Change Number`}</AppText>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <AppButton
          onPress={handleSubmit(onContinueClick)}
          disabled={!isValid || isSubmitting}
          title="Continue"
        />
      </KeyboardAwareScrollView>
    </StepLayout>
  );
};

export default VerifyPhoneNumber;
