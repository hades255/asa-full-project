import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
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
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import {
  actionSetAppLoading,
  actionSetVerificationNumber,
} from "@/redux/app.slice";
import { PhoneNumberResource } from "@clerk/types";
import { useUnistyles } from "react-native-unistyles";

const AddPhoneNumber: React.FC<T_ADD_PHONE_NUMBER> = ({
  flatlistIndex,
  flatlistRef,
  setPhoneObj,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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
      let number = user.phoneNumbers.find(
        (item) => item.verification.status === "verified"
      );
      if (number) {
        setAlreadyVerified(true);
        setVerifiedNumber(number);
      }
    }
  }, [user, isLoaded]);

  const [isNumberValid, setNumberValid] = useState<boolean>(false);
  const onContinueClick = async (formData: T_ADD_PHONE_NUMBER_FIELDS) => {
    try {
      if (!isLoaded || !user) return;

      dispatch(actionSetAppLoading(true));

      let phoneNumber = null;

      // Already exits
      phoneNumber = user.phoneNumbers.find(
        (item) => item.phoneNumber === formData.mobileNumber
      );

      // New Number
      if (!phoneNumber) {
        // Creating new number
        const response = await user.createPhoneNumber({
          phoneNumber: formData.mobileNumber.split("--")[0],
        });
        // Updating local user
        await user.reload();
        phoneNumber = user.phoneNumbers.find((a) => a.id === response.id);
      }

      setPhoneObj(phoneNumber);
      dispatch(actionSetVerificationNumber(formData.mobileNumber));
      await phoneNumber?.prepareVerification();

      flatlistRef.current?.scrollToIndex({
        index: flatlistIndex.value + 1,
        animated: true,
      });

      showSnackbar(`OTP is sent successfully to your mobile number`, "success");
      dispatch(actionSetAppLoading(false));
    } catch (error) {
      console.log('error',error);
      
      showClerkError(error);
      dispatch(actionSetAppLoading(false));
    }
  };

  const onAlreadyVerified = () => {
    flatlistRef.current?.scrollToIndex({
      index: flatlistIndex.value + 2,
      animated: true,
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.bodyContainer}
      showsVerticalScrollIndicator={false}
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
          />
        )}
      </View>
      {alreadyVerified ? (
        <AppButton title="Continue" onPress={onAlreadyVerified} />
      ) : (
        <AppButton
          disabled={!isNumberValid}
          title="Continue"
          onPress={handleSubmit(onContinueClick)}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default AddPhoneNumber;
