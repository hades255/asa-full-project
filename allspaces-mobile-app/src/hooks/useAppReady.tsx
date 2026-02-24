import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SecureStoreService } from "@/config/secureStore";
import { useAuth } from "@clerk/clerk-expo";

const useAppReady = () => {
  const { getToken } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | undefined>(
    undefined
  );
  const [clerkToken, setClerkToken] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
          "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
          "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
          "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        });

        const firstLaunchValue = await SecureStoreService.getValue(
          "FIRST_LAUNCH"
        );

        if (firstLaunchValue) setIsFirstLaunch(false);
        else setIsFirstLaunch(true);

        const token = await getToken();
        setClerkToken(token ? token : "");
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return {
    appIsReady,
    onLayoutRootView,
    isFirstLaunch,
    clerkToken,
  };
};

export default useAppReady;
