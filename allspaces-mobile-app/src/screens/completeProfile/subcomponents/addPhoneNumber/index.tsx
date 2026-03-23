import { Keyboard, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  S_ADD_PHONE_NUMBER_FIELDS,
  T_ADD_PHONE_NUMBER,
  T_ADD_PHONE_NUMBER_FIELDS,
} from "./types";
import { AppButton, AppPhoneInput, AppText } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch } from "@/redux/hooks";
import {
  actionSetAppLoading,
  actionSetVerificationNumber,
} from "@/redux/app.slice";
import { PhoneNumberResource } from "@clerk/types";
import { useUnistyles } from "react-native-unistyles";
import StepLayout from "../stepLayout";
import { styles } from "./styles";

const AddPhoneNumber: React.FC<T_ADD_PHONE_NUMBER> = ({
  setPhoneObj,
  onNext,
  onGoToStep,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_ADD_PHONE_NUMBER_FIELDS),
    defaultValues: {
      mobileNumber: "",
    },
  });

  const [alreadyVerified, setAlreadyVerified] = useState<boolean>(false);
  const [verifiedNumber, setVerifiedNumber] = useState<
    PhoneNumberResource | undefined
  >(undefined);

  useEffect(() => {
    if (isLoaded && user) {
      const number = user.phoneNumbers.find(
        (item) => item.verification.status === "verified"
      );
      if (number) {
        setAlreadyVerified(true);
        setVerifiedNumber(number);
      }
    }
  }, [user, isLoaded]);

  const [isNumberValid, setNumberValid] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isCountryResolved, setIsCountryResolved] = useState(false);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onCountryResolved = useCallback(() => {
    if (isMountedRef.current) {
      setIsCountryResolved(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    // Fallback timeout to ensure loader doesn't block forever
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && !isCountryResolved) {
        setIsCountryResolved(true);
      }
    }, 2000); // 2 second timeout
    
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isCountryResolved]);

  const onContinueClick = async (formData: T_ADD_PHONE_NUMBER_FIELDS) => {
    if (isSubmitting || !isLoaded || !user) return;
    try {
      setSubmitting(true);
      dispatch(actionSetAppLoading(true));

      const sanitizedNumber = formData.mobileNumber.replace(/[^\d+]/g, "");
      let phoneNumber = user.phoneNumbers.find(
        (item) => item.phoneNumber === sanitizedNumber
      );

      if (!phoneNumber) {
        const response = await user.createPhoneNumber({
          phoneNumber: sanitizedNumber,
        });
        await user.reload();
        phoneNumber = user.phoneNumbers.find((a) => a.id === response.id);
      }

      setPhoneObj(phoneNumber);
      dispatch(actionSetVerificationNumber(sanitizedNumber));
      await phoneNumber?.prepareVerification();

      if (!isMountedRef.current) return;

      Keyboard.dismiss();
      showSnackbar(`OTP is sent successfully to your mobile number`, "success");
      onNext();
    } catch (error) {
      showClerkError(error);
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
        dispatch(actionSetAppLoading(false));
      }
    }
  };

  const onAlreadyVerified = () => {
    if (!isMountedRef.current) return;
    Keyboard.dismiss();
    onGoToStep(4);
  };

  return (
    <StepLayout>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topContainer}>
          <View style={{ rowGap: theme.units[1] }}>
            <AppText font="heading2">
              {alreadyVerified ? `Already Verified` : `Add Phone Number`}
            </AppText>
            {alreadyVerified ? (
              <AppText font="button1">
                {`${verifiedNumber?.phoneNumber} `}
                <AppText
                  font="body1"
                  color={theme.colors.semantic.content.contentInverseTertionary}
                >{`is already verified`}</AppText>
              </AppText>
            ) : (
              <AppText
                font="body1"
                color={theme.colors.semantic.content.contentInverseTertionary}
              >{`Enter your phone number to continue`}</AppText>
            )}
          </View>
          {!alreadyVerified && (
            <AppPhoneInput
              control={control}
              name="mobileNumber"
              error={errors.mobileNumber?.message}
              placeholder="Mobile Number"
              onChangeText={setNumberValid}
              label="Mobile Number"
              onCountryResolved={onCountryResolved}
            />
          )}
        </View>
        {alreadyVerified ? (
          <AppButton title="Continue" onPress={onAlreadyVerified} />
        ) : (
          <AppButton
            disabled={!isNumberValid || isSubmitting}
            title="Continue"
            onPress={handleSubmit(onContinueClick)}
          />
        )}
      </KeyboardAwareScrollView>
    </StepLayout>
  );
};

export default AddPhoneNumber;
