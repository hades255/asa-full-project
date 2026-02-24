import { T_ACCOUNT_SUCCESS_SCREEN_ROUTE_PARAMS } from "@/screens/accountSuccess/types";
import { T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS } from "@/screens/createAccount/types";
import { T_FORGET_PASSWORD_ROUTE_PARAMS } from "@/screens/forgetPassword/types";
import { T_LOGIN_SCREEN_ROUTE_PARAMS } from "@/screens/login/types";
import { T_ONBOARDING_SCREEN_ROUTE_PARAMS } from "@/screens/onboarding/types";
import { T_RESET_PASSWORD_SCREEN_ROUTE_PARAMS } from "@/screens/resetPassword/types";
import { T_VERIFY_SCREEN_ROUTE_PARAMS } from "@/screens/verify/types";
import { T_WELCOME_SCREEN_ROUTE_PARAMS } from "@/screens/welcome/types";

export type AuthStackParamList = {
  OnboardingScreen: T_ONBOARDING_SCREEN_ROUTE_PARAMS;
  WelcomeScreen: T_WELCOME_SCREEN_ROUTE_PARAMS;
  LoginScreen: T_LOGIN_SCREEN_ROUTE_PARAMS;
  CreateAccountScreen: T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS;
  VerifyScreen: T_VERIFY_SCREEN_ROUTE_PARAMS;
  AccountSuccessScreen: T_ACCOUNT_SUCCESS_SCREEN_ROUTE_PARAMS;
  ForgetPasswordScreen: T_FORGET_PASSWORD_ROUTE_PARAMS;
  ResetPasswordScreen: T_RESET_PASSWORD_SCREEN_ROUTE_PARAMS;
};
