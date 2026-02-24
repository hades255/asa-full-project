import { Linking, View, AppState } from "react-native";
import React, { useEffect, useRef } from "react";
import { T_ENABLE_LOCATION_SCREEN } from "./types";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import LottieView from "lottie-react-native";
import { LOTTIE } from "assets/lottie";
import { useUnistyles } from "react-native-unistyles";
import {
  geoCodeAPI,
  getLocationPermissionStatus,
  getUserCoordinates,
  requestLocationPermission,
} from "@/utils/location";
import {
  actionSetAppLoading,
  actionSetPermissionStatus,
  actionSetUserLocation,
} from "@/redux/app.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const EnableLocation: React.FC<T_ENABLE_LOCATION_SCREEN> = ({ navigation }) => {
  const { permissionStatus } = useSelector(
    (state: RootState) => state.appSlice
  );
  const appState = useRef(AppState.currentState);

  const { theme } = useUnistyles();
  const dispatch = useDispatch();

  const canAsk = permissionStatus?.canAskAgain;

  const getAndSaveUserLocation = async () => {
    dispatch(actionSetAppLoading(true));
    const locObj = await getUserCoordinates();
    const geoResponse = await geoCodeAPI(
      `${locObj.coords.latitude},${locObj.coords.longitude}`,
      true
    );
    const status = await getLocationPermissionStatus();
    dispatch(actionSetPermissionStatus(status));
    dispatch(actionSetUserLocation(geoResponse));
    dispatch(actionSetAppLoading(false));
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          const status = await getLocationPermissionStatus();
          if (status.granted) await getAndSaveUserLocation();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <LottieView
            autoPlay
            loop
            source={LOTTIE.ENABLE_LOCATION}
            style={styles.lottieView}
          />
          <View style={styles.topContent}>
            <AppText font="heading2" textAlign="center">
              {`Enable Location Access`}
            </AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
              textAlign="center"
            >
              {canAsk
                ? `We use your location to\npersonalize your experience and show nearby content precisely.`
                : `You must provide the location access to proceed further.`}
            </AppText>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <AppButton
            title={canAsk ? `Enable Permission` : `Open Settings`}
            onPress={async () => {
              if (canAsk) {
                let requestStatus = await requestLocationPermission();
                dispatch(actionSetPermissionStatus(null));
                if (requestStatus.granted) await getAndSaveUserLocation();
                dispatch(actionSetPermissionStatus(requestStatus));
              } else Linking.openSettings();
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EnableLocation;
