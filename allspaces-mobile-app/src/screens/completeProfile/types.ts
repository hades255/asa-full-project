import { ProfileSetupStackParamList } from "@/navigation/profileSetupStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

export type T_COMPLETE_PROFILE = NativeStackScreenProps<
  ProfileSetupStackParamList,
  "CompleteProfileScreen"
>;

export type T_COMPLETE_PROFILE_ROUTE_PARAMS = undefined;

export type T_COMPLETE_PROFILE_ITEM = {
  key: string;
  component: React.ReactNode;
};
