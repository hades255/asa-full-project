import { T_CHANGE_PASSWORD_SCREEN_ROUTE_PARAMS } from "@/screens/changePassword/types";
import { T_CONTACT_SUPPORT_SCREEN_ROUTE_PARAMS } from "@/screens/contactSupport/types";
import { T_EDIT_PROFILE_SCREEN_ROUTE_PARAMS } from "@/screens/editProfile/types";
import { T_FAQS_SCREEN_ROUTE_PARAMS } from "@/screens/faqs/types";
import { T_LEADER_BOARD_SCREEN_ROUTE_PARAMS } from "@/screens/leadersboard/types";
import { T_LOGIN_METHODS_SCREEN_ROUTE_PARAMS } from "@/screens/loginMethods/types";
import { T_NOTIF_SETTINGS_SCREEN_ROUTE_PARAMS } from "@/screens/notifSettings/types";
import { T_PAYMENT_METHOD_SCREEN_ROUTE_PARAMS } from "@/screens/paymentMethod/types";
import { T_PRIVACY_POLICY_SCREEN_ROUTE_PARAMS } from "@/screens/privacyPolicy/types";
import { T_SETTINGS_SCREEN_ROUTE_PARAMS } from "@/screens/settings/types";
import { T_TERMS_CONDITIONS_SCREEN_ROUTE_PARAMS } from "@/screens/termsConditions/types";
import { T_USER_PREFERENCES_ROUTE_PARAMS } from "@/screens/userPreferences/types";

export type SettingsStackParamList = {
  SettingsScreen: T_SETTINGS_SCREEN_ROUTE_PARAMS;
  ChangePasswordScreen: T_CHANGE_PASSWORD_SCREEN_ROUTE_PARAMS;
  NotifSettingsScreen: T_NOTIF_SETTINGS_SCREEN_ROUTE_PARAMS;
  PaymentMethodScreen: T_PAYMENT_METHOD_SCREEN_ROUTE_PARAMS;
  PrivacyPolicyScreen: T_PRIVACY_POLICY_SCREEN_ROUTE_PARAMS;
  TermsConditionsScreen: T_TERMS_CONDITIONS_SCREEN_ROUTE_PARAMS;
  FaqsScreen: T_FAQS_SCREEN_ROUTE_PARAMS;
  ContactSupportScreen: T_CONTACT_SUPPORT_SCREEN_ROUTE_PARAMS;
  LeaderBoardScreen: T_LEADER_BOARD_SCREEN_ROUTE_PARAMS;
  EditProfileScreen: T_EDIT_PROFILE_SCREEN_ROUTE_PARAMS;
  LoginMethodsScreen: T_LOGIN_METHODS_SCREEN_ROUTE_PARAMS;
  UserPreferencesScreen: T_USER_PREFERENCES_ROUTE_PARAMS;
};
