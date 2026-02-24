import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import {
  AccountSuccess,
  CreateAccount,
  ForgetPassword,
  Login,
  Onboarding,
  ResetPassword,
  Verify,
  Welcome,
} from "@/screens";
import useAppReady from "@/hooks/useAppReady";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const { isFirstLaunch } = useAppReady();
  if (isFirstLaunch == undefined) return;
  return (
    <Stack.Navigator
      initialRouteName={'OnboardingScreen'}
      // initialRouteName={isFirstLaunch ? "OnboardingScreen" : "WelcomeScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="OnboardingScreen" component={Onboarding} />
      <Stack.Screen name="WelcomeScreen" component={Welcome} />
      <Stack.Screen name="LoginScreen" component={Login} />
      <Stack.Screen name="CreateAccountScreen" component={CreateAccount} />
      <Stack.Screen name="VerifyScreen" component={Verify} />
      <Stack.Screen name="AccountSuccessScreen" component={AccountSuccess} />
      <Stack.Screen name="ForgetPasswordScreen" component={ForgetPassword} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
