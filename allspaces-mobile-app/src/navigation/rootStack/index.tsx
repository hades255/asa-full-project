import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import AuthStack from "../authStack";
import * as SplashScreen from "expo-splash-screen";
import useAppReady from "@/hooks/useAppReady";
import ProfileSetupStack from "../profileSetupStack";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_TYPES } from "@/config/constants";
import ConciergeStack from "../conciergeStack";
import UserStack from "../userStack";
import { linking } from "@/utils/linking";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { appIsReady, onLayoutRootView } = useAppReady();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { completeProfile } = useSelector((state: RootState) => state.appSlice);
  if (!appIsReady || !isLoaded) return null;

  return (
    <NavigationContainer linking={linking} onReady={onLayoutRootView}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : user && user?.unsafeMetadata.type === USER_TYPES.CONCIERGE ? (
          <Stack.Screen name="ConciergeStack" component={ConciergeStack} />
        ) : completeProfile ? (
          <Stack.Screen
            name="ProfileSetupStack"
            component={ProfileSetupStack}
          />
        ) : (
          <Stack.Screen name="UserStack" component={UserStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
