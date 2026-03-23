import { View, Text } from "react-native";
import React, { useEffect } from "react";
import {
  S_CREATE_ACCOUNT_FIELDS,
  T_CREATE_ACCOUNT_FIELDS,
  T_CREATE_ACCOUNT_SCREEN,
} from "./types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppButton,
  AppCheckbox,
  AppInput,
  AppText,
  BackButton,
  ButtonWrapper,
  ScreenWrapper,
} from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { Lock1, Sms } from "iconsax-react-native";
import {
  gotoLoginFromCreateAccount,
  gotoVerifyFromCreateAccount,
} from "@/navigation/service";
import { useSignUp } from "@clerk/clerk-expo";
import { useDispatch } from "@/redux/hooks";
import { actionSetAppLoading, actionSetIsConcierge } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import { globalStyles } from "@/theme";
import { SecureStoreService } from "@/config/secureStore";

const CreateAccount: React.FC<T_CREATE_ACCOUNT_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { isLoaded, signUp } = useSignUp();
  const { setCredentials } = useLocalCredentials();

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_CREATE_ACCOUNT_FIELDS),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Re-validate confirm password when password changes so mismatch/empty password shows error
  useEffect(() => {
    trigger("confirmPassword");
  }, [password, trigger]);

  // Show error immediately when confirmPassword has value and doesn't match
  const shouldShowConfirmPasswordError = confirmPassword && errors.confirmPassword?.message;

  const onCreateAccountClick = async (formData: T_CREATE_ACCOUNT_FIELDS) => {
    try {
      if (!isLoaded) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }

      dispatch(actionSetAppLoading(true));

      await signUp.create({
        emailAddress: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Force biometric prompt for every fresh USER signup.
      await SecureStoreService.deleteValue("BIOMETRIC_ENABLED");
      await SecureStoreService.deleteValue("BIOMETRIC_ASKED");

      gotoVerifyFromCreateAccount(navigation, {
        type: "email",
        credential: formData.email.trim().toLowerCase(),
      });

      try {
        await setCredentials({
          identifier: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
      } catch {
        // Non-critical; continue with signup flow
      }

      dispatch(actionSetAppLoading(false));
    } catch (error: any) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  const onCreateConciergeAccountClick = async (
    formData: T_CREATE_ACCOUNT_FIELDS
  ) => {
    try {
      if (!isLoaded) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }

      dispatch(actionSetAppLoading(true));

      await signUp.create({
        emailAddress: formData.email.trim().toLowerCase(),
        password: formData.password,
        unsafeMetadata: {
          type: "concierge",
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      gotoVerifyFromCreateAccount(navigation, {
        type: "email",
        credential: formData.email.trim().toLowerCase(),
        isConcierge: true,
      });

      dispatch(actionSetIsConcierge(true));

      // Don't set credentials for Partner/Concierge accounts - biometric is only for User accounts
      // Clear any existing biometric credentials when creating Partner account
      try {
        await SecureStoreService.deleteValue("BIOMETRIC_ENABLED");
      } catch {
        // Non-critical; continue with signup flow
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
        keyboardShouldPersistTaps="handled"
      >
        <BackButton />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Create Account`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Join the All Spaces Community`}</AppText>
        </View>

        <View style={{ rowGap: theme.units[4] }}>
          <AppInput
            name="email"
            control={control}
            error={touchedFields.email ? errors.email?.message : undefined}
            label={`Email`}
            placeholder={`Johndoe@gmail.com`}
            KeyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            textInputProps={{
              textContentType: "emailAddress",
              autoComplete: "email",
              keyboardType: "email-address",
            }}
            icon={
              <Sms
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppInput
            name="password"
            control={control}
            error={touchedFields.password ? errors.password?.message : undefined}
            label={`Password`}
            placeholder={`*********`}
            isPassword
            textContentType="newPassword"
            autoComplete="new-password"
            textInputProps={{
              textContentType: "newPassword",
              autoComplete: "new-password",
            }}
            icon={
              <Lock1
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppInput
            name="confirmPassword"
            control={control}
            error={shouldShowConfirmPasswordError ? errors.confirmPassword?.message : undefined}
            label={`Confirm Password`}
            placeholder={`*********`}
            isPassword
            textContentType="newPassword"
            autoComplete="new-password"
            textInputProps={{
              textContentType: "newPassword",
              autoComplete: "new-password",
            }}
            icon={
              <Lock1
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppCheckbox
            control={control}
            name="privacyTermsCheck"
            textComponent={
              <AppText
                font="body1"
                color={theme.colors.semantic.content.contentInverseTertionary}
              >
                {`By continuing, you agree to our\n`}
                <AppText
                  font="button1"
                  color={theme.colors.semanticExtensions.content.contentAccent}
                  style={{ textDecorationLine: "underline" }}
                >{` Privacy Policy `}</AppText>
                <AppText
                  font="body1"
                  color={theme.colors.semantic.content.contentInverseTertionary}
                >{`and`}</AppText>
                <AppText
                  font="button1"
                  color={theme.colors.semanticExtensions.content.contentAccent}
                  style={{ textDecorationLine: "underline" }}
                >{` Terms & Conditions `}</AppText>
              </AppText>
            }
          />
        </View>

        <View style={globalStyles.rowGap12}>
          <AppButton
            disabled={!isValid}
            title="Signup as user"
            onPress={handleSubmit(onCreateAccountClick)}
          />
          <View style={styles.orSeparator}>
            <View style={styles.line} />
            <AppText
              font="caption1"
              textAlign="center"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >{`or`}</AppText>
            <View style={styles.line} />
          </View>
          <AppButton
            disabled={!isValid}
            title="Signup as partner"
            onPress={handleSubmit(onCreateConciergeAccountClick)}
          />
        </View>
        <ButtonWrapper
          onPress={() => {
            gotoLoginFromCreateAccount(navigation);
          }}
        >
          <AppText
            font="body1"
            textAlign="center"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >
            {`Already have an account? `}
            <AppText
              font="button1"
              color={theme.colors.semantic.content.contentPrimary}
            >{`Log In`}</AppText>
          </AppText>
        </ButtonWrapper>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default CreateAccount;
