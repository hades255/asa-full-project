import React, { useEffect } from "react";
import { S_LOGIN_FIELDS, T_LOGIN_FIELDS, T_LOGIN_SCREEN } from "./types";
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
import { View } from "react-native";
import { Lock1, Sms } from "iconsax-react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  gotoCreateAccountFromLogin,
  gotoForgetPasswordFromLogin,
} from "@/navigation/service";
import { useSignIn } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { SecureStoreService } from "@/config/secureStore";
import { useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import useBiometric from "@/hooks/useBiometric";

const Login: React.FC<T_LOGIN_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  // Clerk
  const dispatch = useDispatch();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { hasCredentials, setCredentials, authenticate, biometricType } =
    useLocalCredentials();
  const { isBiometricEnabled, authBiometric } = useBiometric();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_LOGIN_FIELDS),
    defaultValues: {
      email: __DEV__ ? "u001+clerk_test@allspaces.com" : "",
      password: __DEV__ ? "JustDoIt@321" : "",
    },
  });

  const completeLogin = async (createdSessionId: string) => {
    if (!isLoaded && !setActive) return null;

    await SecureStoreService.saveValue("SESSION_ID", createdSessionId);
    await setActive({ session: createdSessionId });
  };

  const onLoginClick = async (formData: T_LOGIN_FIELDS) => {
    try {
      if (!isLoaded) return;

      dispatch(actionSetAppLoading(true));

      const signInAttempt = await signIn.create({
        identifier: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        if (signInAttempt.createdSessionId) {
          await completeLogin(signInAttempt.createdSessionId);
          // For biometric login
          await setCredentials({
            identifier: formData.email.trim().toLowerCase(),
            password: formData.password,
          });
          showSnackbar(`Welcome back!`, `success`);

          if (formData.rememberMe) {
            await SecureStoreService.saveValue(
              "USER_EMAIL",
              formData.email.trim().toLowerCase()
            );
            await SecureStoreService.saveValue(
              "USER_PASSWORD",
              formData.password
            );
          } else {
            await SecureStoreService.deleteValue("USER_EMAIL");
            await SecureStoreService.deleteValue("USER_PASSWORD");
          }
        } else {
          showSnackbar(`Something is going wrong while logging in.`, "error");
        }
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        showSnackbar(JSON.stringify(signInAttempt, null, 2), `error`);
      }
      dispatch(actionSetAppLoading(false));
    } catch (error) {
      showClerkError(error);
      dispatch(actionSetAppLoading(false));
    }
  };

  useEffect(() => {
    const getRememberMeValues = async () => {
      const email = await SecureStoreService.getValue("USER_EMAIL");
      const password = await SecureStoreService.getValue("USER_PASSWORD");
      if (email && password)
        reset({
          email: email,
          password: password,
        });
    };
    getRememberMeValues();
  }, []);

  const onBiometricLogin = async () => {
    try {
      if (!isLoaded) return;

      if (!hasCredentials) {
        showSnackbar(
          `Please login first Email & Password to setup biometric login`,
          "warning"
        );
        return;
      }

      const localAuth = await authBiometric();
      if (!localAuth) {
        showSnackbar(
          `${
            biometricType === "face-recognition" ? "Face ID" : "Touch ID"
          } authorization failed!`,
          "error"
        );
        return;
      }

      const signInAttempt = await authenticate();

      if (signInAttempt.status === "complete") {
        showSnackbar(`Welcome back!`, `success`);
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why.
        // User may need to complete further steps.
        showSnackbar(JSON.stringify(signInAttempt, null, 2), `error`);
      }
    } catch (error) {
      showSnackbar(`Something went wrong while biometric login`, "error");
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        keyboardShouldPersistTaps="never"
      >
        <BackButton />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Welcome back`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Enter your details to login`}</AppText>
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
          <AppInput
            name="password"
            control={control}
            error={errors.password?.message}
            label={`Password`}
            placeholder={`*********`}
            isPassword
            icon={
              <Lock1
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />

          <View style={styles.formRow}>
            <AppCheckbox
              control={control}
              name="rememberMe"
              message="Remember me"
            />
            <AppText
              textProps={{
                onPress: () => gotoForgetPasswordFromLogin(navigation),
              }}
              font="body1"
              style={{ textDecorationLine: "underline" }}
            >{`forgot password?`}</AppText>
          </View>
        </View>

        <View>
          <AppButton
            disabled={!isValid}
            title="Log In"
            onPress={handleSubmit(onLoginClick)}
          />
          {isBiometricEnabled && hasCredentials && biometricType ? (
            <AppButton
              disabled={!isValid}
              icon={
                <MaterialCommunityIcons
                  name={
                    biometricType === "face-recognition"
                      ? "face-recognition"
                      : "fingerprint"
                  }
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              }
              title={`Login with ${
                biometricType === "face-recognition" ? `Face ID` : `Touch ID`
              }`}
              variant="text-btn"
              onPress={onBiometricLogin}
            />
          ) : null}
        </View>
        <ButtonWrapper
          onPress={() => {
            gotoCreateAccountFromLogin(navigation);
          }}
        >
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
            textAlign="center"
          >
            {`Don’t have an account? `}
            <AppText font="button1" textAlign="center">{`Sign up`}</AppText>
          </AppText>
        </ButtonWrapper>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default Login;
