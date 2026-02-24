import { View, Text } from "react-native";
import React, { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";

const PersonalInfo: React.FC<T_PERSONAL_INFO> = ({
  flatlistIndex,
  flatlistRef,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_PERSONAL_INFO_FIELDS),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
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
          : new Date(),
      });
    }
  }, [user]);

  const onContinueClick = async (formData: T_PERSONAL_INFO_FIELDS) => {
    try {
      if (!isLoaded || !user) return;

      dispatch(actionSetAppLoading(true));

      await user.update({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          dob: formData.dateOfBirth,
        },
      });

      // Updating Local user
      await user.reload();

      flatlistRef.current?.scrollToIndex({
        index: flatlistIndex.value + 1,
        animated: true,
      });

      showSnackbar(`Personal Info is updated successfully.`, "success");
      dispatch(actionSetAppLoading(false));
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.bodyContainer}
      showsVerticalScrollIndicator={false}
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
            />
            <AppInput
              width={"46%"}
              name="lastName"
              control={control}
              error={errors.lastName?.message}
              label={`Last Name`}
              placeholder={`Doe`}
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
        disabled={!isValid}
        title="Continue"
        onPress={handleSubmit(onContinueClick)}
      />
    </KeyboardAwareScrollView>
  );
};

export default PersonalInfo;
