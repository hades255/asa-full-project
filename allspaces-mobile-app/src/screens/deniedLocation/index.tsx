import { Linking, View } from "react-native";
import React from "react";
import { T_DENIED_LOCATION_SCREEN } from "./types";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import LottieView from "lottie-react-native";
import { LOTTIE } from "assets/lottie";
import { useUnistyles } from "react-native-unistyles";
import * as ExpoLocation from "expo-location";
import {
  geoCodeAPI,
  getUserCoordinates,
  requestLocationPermission,
} from "@/utils/location";
import { store } from "@/redux/store";
import { actionSetAppLoading, actionSetUserLocation } from "@/redux/app.slice";
import { useDispatch } from "react-redux";

const DeniedLocation: React.FC<T_DENIED_LOCATION_SCREEN> = ({
  navigation,
  route,
}) => {
  const { permissionStatus, setPermissionStatus } = route.params;
  const { theme } = useUnistyles();
  const dispatch = useDispatch();

  const canAsk =
    permissionStatus?.canAskAgain &&
    permissionStatus.status == ExpoLocation.PermissionStatus.UNDETERMINED;

  const getAndSaveUserLocation = async () => {
    dispatch(actionSetAppLoading(true));
    const locObj = await getUserCoordinates();
    const geoResponse = await geoCodeAPI(
      `${locObj.coords.latitude},${locObj.coords.longitude}`,
      true
    );
    store.dispatch(actionSetUserLocation(geoResponse));
    dispatch(actionSetAppLoading(false));
  };

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
                setPermissionStatus(requestStatus);
              } else Linking.openSettings();
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DeniedLocation;
