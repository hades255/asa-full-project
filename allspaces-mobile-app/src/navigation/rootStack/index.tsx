import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import * as SplashScreen from "expo-splash-screen";
import useAppReady from "@/hooks/useAppReady";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSelector } from "@/redux/hooks";
import { USER_TYPES } from "@/config/constants";
import { linking } from "@/utils/linking";
import { selectCompleteProfile } from "@/redux/selectors";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { appIsReady, onLayoutRootView } = useAppReady();
  const { isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const completeProfile = useSelector(selectCompleteProfile);

  if (!appIsReady || !isLoaded || !userLoaded) {
    return null;
  }

  const handleNavigationReady = () => {
    if (__DEV__) {
      const bootTs = (globalThis as any).__ALLSPACES_BOOT_TS__;
      if (typeof bootTs === "number") {
        const startupMs = Date.now() - bootTs;
        console.log(`[Perf] Navigation ready in ${startupMs}ms`);
      }
    }
    onLayoutRootView();
  };

  return (
    <NavigationContainer linking={linking} onReady={handleNavigationReady}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn ? (
          <Stack.Screen
            name="AuthStack"
            getComponent={() => require("../authStack").default}
          />
        ) : user && user?.unsafeMetadata.type === USER_TYPES.CONCIERGE ? (
          <Stack.Screen
            name="ConciergeStack"
            getComponent={() => require("../conciergeStack").default}
          />
        ) : completeProfile ? (
          <Stack.Screen
            name="ProfileSetupStack"
            getComponent={() => require("../profileSetupStack").default}
          />
        ) : (
          <Stack.Screen
            name="UserStack"
            getComponent={() => require("../userStack").default}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
