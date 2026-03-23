import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "@/redux/hooks";
import { useUnistyles } from "react-native-unistyles";
import { ScreenWrapper } from "@/components";
import { T_STARTUP_LOADING_SCREEN } from "./types";
import {
  geoCodeAPI,
  getLocationPermissionStatus,
  getUserCoordinates,
} from "@/utils/location";
import {
  actionSetPermissionStatus,
  actionSetUserLocation,
} from "@/redux/app.slice";

const StartupLoading: React.FC<T_STARTUP_LOADING_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();

  useEffect(() => {
    let isMounted = true;

    const runStartupChecks = async () => {
      const fallbackPermissionStatus = {
        granted: false,
        canAskAgain: true,
      };

      try {
        const permissionStatus = await Promise.race([
          getLocationPermissionStatus(),
          new Promise<typeof fallbackPermissionStatus>((resolve) =>
            setTimeout(() => resolve(fallbackPermissionStatus), 4000)
          ),
        ]);

        if (!isMounted) return;

        dispatch(
          actionSetPermissionStatus({
            granted: permissionStatus.granted,
            canAskAgain: permissionStatus.canAskAgain,
          })
        );

        if (!permissionStatus.granted) {
          navigation.replace("EnableLocationScreen");
          return;
        }

        const locObj = await Promise.race([
          getUserCoordinates(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);

        if (!isMounted) return;

        if (locObj) {
          const geoResponse = await geoCodeAPI(
            `${locObj.coords.latitude},${locObj.coords.longitude}`,
            true
          );
          if (isMounted && geoResponse) {
            dispatch(actionSetUserLocation(geoResponse));
          }
        }

        if (isMounted) {
          navigation.replace("UserStack", undefined);
        }
      } catch (error) {
        if (!isMounted) return;
        dispatch(actionSetPermissionStatus(fallbackPermissionStatus));
        navigation.replace("EnableLocationScreen");
      }
    };

    runStartupChecks();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigation]);

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="small" color={theme.colors.core.primaryA} />
      </View>
    </ScreenWrapper>
  );
};

export default StartupLoading;
