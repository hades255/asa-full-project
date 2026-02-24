import { View, Text } from "react-native";
import React from "react";
import {
  S_CHANGE_PASSWORD_FIELDS,
  T_CHANGE_PASSWORD_FIELDS,
  T_CHANGE_PASSWORD_SCREEN,
} from "./types";
import { AppButton, AppInput, Header2, ScreenWrapper } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock1 } from "iconsax-react-native";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-expo";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";

const ChangePassword: React.FC<T_CHANGE_PASSWORD_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const { theme } = useUnistyles();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_CHANGE_PASSWORD_FIELDS),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onUpdateClick = async (formData: T_CHANGE_PASSWORD_FIELDS) => {
    try {
      if (!isLoaded || !user) return;
      dispatch(actionSetAppLoading(true));

      await user.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      showSnackbar(`Your password is updated successfully`, "success");
      navigation.goBack();

      reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      dispatch(actionSetAppLoading(false));
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  return (
    <ScreenWrapper>
      <Header2 title="Change Password" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
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
            name="currentPassword"
            label="Current Password"
            placeholder="********"
            error={errors.currentPassword?.message}
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
            name="confirmNewPassword"
            label="Confirm New Password"
            placeholder="********"
            error={errors.confirmNewPassword?.message}
          />
        </View>
        <AppButton
          disabled={!isValid}
          onPress={handleSubmit(onUpdateClick)}
          title="Update Password"
        />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default ChangePassword;
