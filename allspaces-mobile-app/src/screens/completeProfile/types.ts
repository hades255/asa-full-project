import { ProfileSetupStackParamList } from "@/navigation/profileSetupStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

export type T_COMPLETE_PROFILE = NativeStackScreenProps<
  ProfileSetupStackParamList,
  "CompleteProfileScreen"
>;

export type T_COMPLETE_PROFILE_ROUTE_PARAMS = undefined;

export const STEP_COUNT = 6;
