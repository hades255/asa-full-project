import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileSetupStackParamList } from "./types";
import { AllSet, CompleteProfile } from "@/screens";

const Stack = createNativeStackNavigator<ProfileSetupStackParamList>();

const ProfileSetupStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"CompleteProfileScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="CompleteProfileScreen" component={CompleteProfile} />
      <Stack.Screen name="AllSetScreen" component={AllSet} />
    </Stack.Navigator>
  );
};

export default ProfileSetupStack;
