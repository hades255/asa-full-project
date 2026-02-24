import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "./types";
import {
  ChangePassword,
  ContactSupport,
  EditProfile,
  Faqs,
  Leaderboard,
  LoginMethods,
  NotifSettings,
  PaymentMethod,
  PrivacyScreen,
  Settings,
  TermsConditions,
  UserPreferences,
} from "@/screens";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"SettingsScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="SettingsScreen" component={Settings} />
      <Stack.Screen name="LoginMethodsScreen" component={LoginMethods} />
      <Stack.Screen name="EditProfileScreen" component={EditProfile} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
      <Stack.Screen name="NotifSettingsScreen" component={NotifSettings} />
      <Stack.Screen name="PaymentMethodScreen" component={PaymentMethod} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyScreen} />
      <Stack.Screen name="TermsConditionsScreen" component={TermsConditions} />
      <Stack.Screen name="FaqsScreen" component={Faqs} />
      <Stack.Screen name="ContactSupportScreen" component={ContactSupport} />
      <Stack.Screen name="LeaderBoardScreen" component={Leaderboard} />
      <Stack.Screen name="UserPreferencesScreen" component={UserPreferences} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
