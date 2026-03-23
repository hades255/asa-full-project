import { View, Keyboard } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  S_PERSONAL_INFO_FIELDS,
  T_PERSONAL_INFO,
  T_PERSONAL_INFO_FIELDS,
} from "./types";
import { styles } from "./styles";
import {
  AppButton,
  AppDatePicker,
  AppInput,
  AppText,
  Avatar,
} from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch } from "@/redux/hooks";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";
import StepLayout from "../stepLayout";

/** Default date of birth: same day and month, 15 years ago (e.g. 2026 → 2011). */
const getDefaultDateOfBirth = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 15);
  return d;
};

const PersonalInfo: React.FC<T_PERSONAL_INFO> = ({ onNext }) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const defaultDateOfBirth = useMemo(getDefaultDateOfBirth, []);
  const [isSubmitting, setSubmitting] = useState(false);
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
  } = useForm<T_PERSONAL_INFO_FIELDS>({
    mode: "onChange",
    resolver: yupResolver(S_PERSONAL_INFO_FIELDS),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: defaultDateOfBirth.toISOString(),
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        // @ts-ignore
        dateOfBirth: user.unsafeMetadata.dob
          ? // @ts-ignore
            new Date(user.unsafeMetadata.dob)
          : defaultDateOfBirth.toISOString(),
      });
    }
  }, [user, defaultDateOfBirth]);

  const onContinueClick = async (formData: T_PERSONAL_INFO_FIELDS) => {
    if (!isLoaded || !user || isSubmitting) return;
    try {
      setSubmitting(true);
      dispatch(actionSetAppLoading(true));

      await user.update({
        firstName: (formData.firstName ?? "").trim(),
        lastName: (formData.lastName ?? "").trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          dob: formData.dateOfBirth,
        },
      });

      await user.reload();

      if (isMountedRef.current) {
        Keyboard.dismiss();
        showSnackbar(`Personal Info is updated successfully.`, "success");
        onNext();
      }
    } catch (error) {
      showClerkError(error);
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
        contentContainerStyle={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topContainer}>
          <View style={{ rowGap: theme.units[1] }}>
            <AppText font="heading2">{`Personal Information`}</AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >{`Enter your personal information to continue`}</AppText>
          </View>
          <View style={{ rowGap: theme.units[4] }}>
            <Avatar editable type="add" />
            <View style={styles.row}>
              <AppInput
                width={"46%"}
                name="firstName"
                control={control}
                error={errors.firstName?.message}
                label={`First Name`}
                placeholder={`John`}
                KeyboardType="default"
                textInputProps={{
                  textContentType: "givenName",
                  autoComplete: "given-name",
                }}
              />
              <AppInput
                width={"46%"}
                name="lastName"
                control={control}
                error={errors.lastName?.message}
                label={`Last Name`}
                placeholder={`Doe`}
                KeyboardType="default"
                textInputProps={{
                  textContentType: "familyName",
                  autoComplete: "family-name",
                }}
              />
            </View>
            <AppDatePicker
              control={control}
              name="dateOfBirth"
              error={errors.dateOfBirth?.message}
              label="Date of Birth"
              placeholder="MM/DD/YYYY"
            />
          </View>
        </View>
        <AppButton
          disabled={!isValid || isSubmitting}
          title="Continue"
          onPress={handleSubmit(onContinueClick)}
        />
      </KeyboardAwareScrollView>
    </StepLayout>
  );
};

export default PersonalInfo;
