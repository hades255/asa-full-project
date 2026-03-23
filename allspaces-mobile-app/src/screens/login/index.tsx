import React, { useEffect, useRef } from "react";
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
import { useSignIn, useClerk, useAuth, useUser } from "@clerk/clerk-expo";
import { useDispatch } from "@/redux/hooks";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { SecureStoreService } from "@/config/secureStore";
import { useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import useBiometric from "@/hooks/useBiometric";
import { USER_TYPES } from "@/config/constants";

const Login: React.FC<T_LOGIN_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { signIn, setActive: setActiveSignIn, isLoaded } = useSignIn();
  const { setActive: setActiveClerk } = useClerk();
  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { hasCredentials, setCredentials, authenticate, biometricType } =
    useLocalCredentials();
  const { isBiometricEnabled } = useBiometric();
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBiometricInProgressRef = useRef(false);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_LOGIN_FIELDS),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const completeLogin = async (createdSessionId: string) => {
    if (!isLoaded) {
      showSnackbar("Authentication service is not ready. Please try again.", "error");
      return false;
    }

    try {
      await SecureStoreService.saveValue("SESSION_ID", createdSessionId);

      let activated = false;
      if (setActiveSignIn) {
        try {
          await setActiveSignIn({ session: createdSessionId });
          activated = true;
        } catch (err: any) {
          if (setActiveClerk) {
            try {
              await setActiveClerk({ session: createdSessionId });
              activated = true;
            } catch {
              throw err;
            }
          } else {
            throw err;
          }
        }
      } else if (setActiveClerk) {
        await setActiveClerk({ session: createdSessionId });
        activated = true;
      }

      if (!activated) {
        showSnackbar("Session activation is not available. Please try again.", "error");
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      let token: string | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          token = await getToken();
          if (token) break;
        } catch {
          /* ignore */
        }
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      if (!token) {
        showSnackbar("Sign-in could not be verified. Please try again.", "error");
        return false;
      }

      return true;
    } catch (error: any) {
      showClerkError(error);
      showSnackbar("Unable to complete sign-in. Please try again.", "error");
      return false;
    }
  };

  const onLoginClick = async (formData: T_LOGIN_FIELDS) => {
    try {
      if (!isLoaded) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }

      dispatch(actionSetAppLoading(true));

      const signInAttempt = await signIn.create({
        identifier: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        if (signInAttempt.createdSessionId) {
          const loginSuccess = await completeLogin(signInAttempt.createdSessionId);

          if (!loginSuccess) {
            dispatch(actionSetAppLoading(false));
            return;
          }

          try {
            await setCredentials({
              identifier: formData.email.trim().toLowerCase(),
              password: formData.password,
            });
          } catch {
            // Non-critical; continue with login
          }

          // Reload user data after login
          if (userLoaded && user) {
            await user.reload();
          }

          showSnackbar("Welcome back!", "success");

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

          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = setTimeout(() => {
            loadingTimeoutRef.current = null;
            dispatch(actionSetAppLoading(false));
          }, 500);
        } else {
          showSnackbar("Something went wrong while logging in. Please try again.", "error");
          dispatch(actionSetAppLoading(false));
        }
      } else {
        const msg =
          signInAttempt.status === "needs_identifier"
            ? "Please enter a valid email and password."
            : signInAttempt.status === "needs_first_factor"
              ? "Additional verification is required. Please try again."
              : "Login could not be completed. Please try again.";
        showSnackbar(msg, "error");
        dispatch(actionSetAppLoading(false));
      }
    } catch (error: any) {
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
    if (isBiometricInProgressRef.current) return;
    try {
      isBiometricInProgressRef.current = true;
      if (!isLoaded) {
        showSnackbar("Authentication service is not ready. Please try again.", "error");
        return;
      }

      if (!hasCredentials) {
        showSnackbar(
          "Please sign in with email and password first to enable biometric login.",
          "warning"
        );
        return;
      }

      const signInAttempt = await authenticate();

      if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
        const success = await completeLogin(signInAttempt.createdSessionId);
        if (success) {
          // Wait a bit for user data to be available after session activation
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Check user type - biometric should only work for User accounts, not Partner/Concierge
          // Reload user to get latest metadata after login
          if (userLoaded && user) {
            await user.reload();
            if (user?.unsafeMetadata?.type === USER_TYPES.CONCIERGE) {
              showSnackbar("Biometric login is only available for User accounts.", "error");
              // Clear biometric credentials for Partner accounts
              await SecureStoreService.deleteValue("BIOMETRIC_ENABLED");
              return;
            }
            
            // Reload user data after biometric login
            await user.reload();
          }
          showSnackbar("Welcome back!", "success");
        }
      } else {
        showSnackbar("Biometric sign-in could not be completed. Please try again or use email and password.", "error");
      }
    } catch (error: any) {
      showClerkError(error);
      showSnackbar("Unable to complete sign-in. Please try again.", "error");
    } finally {
      isBiometricInProgressRef.current = false;
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
            error={errors.password?.message}
            label={`Password`}
            placeholder={`*********`}
            isPassword
            textContentType="password"
            autoComplete="password"
            textInputProps={{
              textContentType: "password",
              autoComplete: "password",
            }}
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
              title={`Login with ${biometricType === "face-recognition" ? `Face ID` : `Touch ID`
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
