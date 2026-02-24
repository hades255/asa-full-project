import { View } from "react-native";
import React from "react";
import {
  S_FORGET_PASSWORD_FIELDS,
  T_FORGET_PASSWORD,
  T_FORGET_PASSWORD_FIELDS,
} from "./types";
import {
  AppButton,
  AppInput,
  AppText,
  BackButton,
  ScreenWrapper,
} from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { Sms } from "iconsax-react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch } from "react-redux";
import { useSignIn } from "@clerk/clerk-expo";
import { actionSetAppLoading } from "@/redux/app.slice";
import { gotoResetPasswordFromForget } from "@/navigation/service";
import { useUnistyles } from "react-native-unistyles";

const ForgetPassword: React.FC<T_FORGET_PASSWORD> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isLoaded, signIn } = useSignIn();
  const { theme } = useUnistyles();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_FORGET_PASSWORD_FIELDS),
    defaultValues: {
      email: __DEV__ ? "concierge+clerk_test@allspaces.com" : "",
    },
  });

  const onContinueClick = async (formData: T_FORGET_PASSWORD_FIELDS) => {
    try {
      if (!isLoaded || !signIn) return;

      dispatch(actionSetAppLoading(true));

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: formData.email.trim().toLowerCase(),
      });

      showSnackbar(`OTP is sent to your email.`, "success");

      gotoResetPasswordFromForget(navigation, {
        email: formData.email.trim().toLowerCase(),
      });

      dispatch(actionSetAppLoading(false));
    } catch (error) {
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
          <AppText font="heading2">{`Forget Password?`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Enter your email to reset password`}</AppText>
        </View>

        <View style={{ rowGap: theme.units[4] }}>
          <AppInput
            name="email"
            control={control}
            error={errors.email?.message}
            label={`Email`}
            placeholder={`Johndoe@gmail.com`}
            icon={
              <Sms
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
        </View>

        <AppButton
          disabled={!isValid}
          title="Continue"
          onPress={handleSubmit(onContinueClick)}
        />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default ForgetPassword;
