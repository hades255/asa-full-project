import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./authStack/types";
import { T_WELCOME_SCREEN_ROUTE_PARAMS } from "@/screens/welcome/types";
import { T_LOGIN_SCREEN_ROUTE_PARAMS } from "@/screens/login/types";
import { T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS } from "@/screens/createAccount/types";
import { T_VERIFY_SCREEN_ROUTE_PARAMS } from "@/screens/verify/types";
import { T_ACCOUNT_SUCCESS_SCREEN_ROUTE_PARAMS } from "@/screens/accountSuccess/types";
import { T_COMPLETE_PROFILE_ROUTE_PARAMS } from "@/screens/completeProfile/types";
import { ProfileSetupStackParamList } from "./profileSetupStack/types";
import { T_ALL_SET_SCREEN_ROUTE_PARAMS } from "@/screens/allSet/types";
import { BottomTabsParamList } from "./bottomTabs/types";
import { SettingsStackParamList } from "./settingsStack/types";
import { T_CHANGE_PASSWORD_SCREEN_ROUTE_PARAMS } from "@/screens/changePassword/types";
import { T_NOTIF_SETTINGS_SCREEN_ROUTE_PARAMS } from "@/screens/notifSettings/types";
import { T_PAYMENT_METHOD_SCREEN_ROUTE_PARAMS } from "@/screens/paymentMethod/types";
import { T_PRIVACY_POLICY_SCREEN_ROUTE_PARAMS } from "@/screens/privacyPolicy/types";
import { T_TERMS_CONDITIONS_SCREEN_ROUTE_PARAMS } from "@/screens/termsConditions/types";
import { T_FAQS_SCREEN_ROUTE_PARAMS } from "@/screens/faqs/types";
import { T_CONTACT_SUPPORT_SCREEN_ROUTE_PARAMS } from "@/screens/contactSupport/types";
import { T_LEADER_BOARD_SCREEN_ROUTE_PARAMS } from "@/screens/leadersboard/types";
import { T_FORGET_PASSWORD_ROUTE_PARAMS } from "@/screens/forgetPassword/types";
import { T_RESET_PASSWORD_SCREEN_ROUTE_PARAMS } from "@/screens/resetPassword/types";
import { T_EDIT_PROFILE_SCREEN_ROUTE_PARAMS } from "@/screens/editProfile/types";
import { FavouritesStackParamList } from "./favouritesStack/types";
import { T_BOOKING_ORDER_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/bookingOrderDetails/types";
import { T_BOOKING_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/bookingDetails/types";
import { HomeStackParamList } from "./homeStack/types";
import { T_PAYMENT_SCREEN_ROUTE_PARAMS } from "@/screens/paymentScreen/types";
import { ConciergeStackParamList } from "./conciergeStack/types";
import { T_SCAN_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/concierge/scanDetails/types";
import { T_ORDER_SUMMARY_SCREEN_ROUTE_PARAMS } from "@/screens/orderSummary/types";
import { BookingsStackParamList } from "./bookingsStack/types";
import { T_ORDER_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/orderDetails/types";
import { T_RATE_BOOKING_SCREEN_ROUTE_PARAMS } from "@/screens/rateBooking/types";
import { T_LOGIN_METHODS_SCREEN_ROUTE_PARAMS } from "@/screens/loginMethods/types";
import { T_USER_PREFERENCES_ROUTE_PARAMS } from "@/screens/userPreferences/types";

export const gotoWelcomeFromOnboard = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "OnboardingScreen">,
  params?: T_WELCOME_SCREEN_ROUTE_PARAMS
) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "WelcomeScreen", params }],
  });
};

export const gotoLoginFromWelcome = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "WelcomeScreen">,
  params?: T_LOGIN_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("LoginScreen", params);
};

export const gotoCreateAccountFromWelcome = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "WelcomeScreen">,
  params?: T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("CreateAccountScreen", params);
};

export const gotoCreateAccountFromLogin = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
  params?: T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS
) => {
  navigation.replace("CreateAccountScreen", params);
};

export const gotoLoginFromCreateAccount = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "CreateAccountScreen"
  >,
  params?: T_LOGIN_SCREEN_ROUTE_PARAMS
) => {
  navigation.replace("LoginScreen", params);
};

export const gotoVerifyFromCreateAccount = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "CreateAccountScreen"
  >,
  params: T_VERIFY_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("VerifyScreen", params);
};

export const gotoAccountSuccessFromVerify = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "VerifyScreen">,
  params?: T_ACCOUNT_SUCCESS_SCREEN_ROUTE_PARAMS
) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "AccountSuccessScreen", params }],
  });
};

export const gotoProfileStackFromAuth = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "AccountSuccessScreen"
  >,
  params?: T_COMPLETE_PROFILE_ROUTE_PARAMS
) => {
  navigation.getParent()?.navigate("ProfileSetupStack", params);
};

export const gotoAllSetFromCompleteProfile = (
  navigation: NativeStackNavigationProp<
    ProfileSetupStackParamList,
    "CompleteProfileScreen"
  >,
  params?: T_ALL_SET_SCREEN_ROUTE_PARAMS
) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "AllSetScreen", params }],
  });
};

export const gotoUserTabsFromAllSet = (
  navigation: NativeStackNavigationProp<
    ProfileSetupStackParamList,
    "AllSetScreen"
  >,
  params?: BottomTabsParamList
) => {
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: "UserStack", params }],
  });
};

export const gotoUserTabsFromAccountSuccess = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "AccountSuccessScreen"
  >,
  params?: BottomTabsParamList
) => {
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: "UserStack", params }],
  });
};

export const gotoUserTabsFromLogin = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
  params?: BottomTabsParamList
) => {
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: "UserStack", params }],
  });
};

export const gotoAuthStackFromSettings = (
  navigation: NativeStackNavigationProp<
    SettingsStackParamList,
    "SettingsScreen"
  >,
  params?: AuthStackParamList
) => {
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: "AuthStack", params }],
  });
};

export const gotoPaymentFromBookingOrderDetails = (
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    "BookingOrderDetailScreen"
  >,
  params: T_PAYMENT_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("PaymentScreen", params);
};

export const gotoBookingOrderDetailsFromFavorites = (
  navigation: NativeStackNavigationProp<
    FavouritesStackParamList,
    "FavouritesScreen"
  >,
  params?: T_BOOKING_DETAILS_SCREEN_ROUTE_PARAMS
) => {
  // navigation.navigate("ForgetPasswordScreen", params);
  navigation.getParent()?.navigate("HomeStack", {
    screen: "BookingDetailScreen",
    params,
  });
};

export const gotoForgetPasswordFromLogin = (
  navigation: NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
  params?: T_FORGET_PASSWORD_ROUTE_PARAMS
) => {
  navigation.navigate("ForgetPasswordScreen", params);
};

export const gotoResetPasswordFromForget = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "ForgetPasswordScreen"
  >,
  params: T_RESET_PASSWORD_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("ResetPasswordScreen", params);
};

export const gotoLoginFromResetPassword = (
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "ResetPasswordScreen"
  >,
  params?: T_LOGIN_SCREEN_ROUTE_PARAMS
) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "LoginScreen", params }],
  });
};

export const gotoSubMenuFromSettings = (
  navigation: NativeStackNavigationProp<
    SettingsStackParamList,
    "SettingsScreen"
  >,
  key:
    | "ChangePasswordScreen"
    | "LoginMethodsScreen"
    | "NotifSettingsScreen"
    | "PaymentMethodScreen"
    | "PrivacyPolicyScreen"
    | "TermsConditionsScreen"
    | "FaqsScreen"
    | "ContactSupportScreen"
    | "EditProfileScreen"
    | "LeaderBoardScreen"
    | "UserPreferencesScreen",
  params?:
    | T_CHANGE_PASSWORD_SCREEN_ROUTE_PARAMS
    | T_LOGIN_METHODS_SCREEN_ROUTE_PARAMS
    | T_NOTIF_SETTINGS_SCREEN_ROUTE_PARAMS
    | T_PAYMENT_METHOD_SCREEN_ROUTE_PARAMS
    | T_PRIVACY_POLICY_SCREEN_ROUTE_PARAMS
    | T_TERMS_CONDITIONS_SCREEN_ROUTE_PARAMS
    | T_FAQS_SCREEN_ROUTE_PARAMS
    | T_CONTACT_SUPPORT_SCREEN_ROUTE_PARAMS
    | T_EDIT_PROFILE_SCREEN_ROUTE_PARAMS
    | T_LEADER_BOARD_SCREEN_ROUTE_PARAMS
    | T_USER_PREFERENCES_ROUTE_PARAMS
) => {
  navigation.navigate(key, params);
};

export const gotoScanDetailsFromScanning = (
  navigation: NativeStackNavigationProp<
    ConciergeStackParamList,
    "ScanningScreen"
  >,
  params: T_SCAN_DETAILS_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("ScanDetailsScreen", params);
};

export const gotoOrderSummaryFromBookings = (
  navigation: NativeStackNavigationProp<
    BookingsStackParamList,
    "BookingsScreen"
  >,
  params: T_ORDER_SUMMARY_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("OrderSummaryScreen", params);
};

export const gotoOrderDetailsFromBookings = (
  navigation: NativeStackNavigationProp<
    BookingsStackParamList,
    "BookingsScreen"
  >,
  params: T_ORDER_DETAILS_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("OrderDetailsScreen", params);
};

export const gotoRateBookingFromOrderDetails = (
  navigation: NativeStackNavigationProp<
    BookingsStackParamList,
    "OrderDetailsScreen"
  >,
  params: T_RATE_BOOKING_SCREEN_ROUTE_PARAMS
) => {
  navigation.navigate("RateBookingScreen", params);
};
