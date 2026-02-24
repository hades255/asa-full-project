import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserStackParamList } from "./types";
import DrawerStack from "../drawerStack";
import { EnableLocation } from "@/screens";
import { ActivityIndicator, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./styles";
import { ScreenWrapper } from "@/components";
import {
  geoCodeAPI,
  getLocationPermissionStatus,
  getUserCoordinates,
} from "@/utils/location";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  actionSetPermissionStatus,
  actionSetUserLocation,
} from "@/redux/app.slice";

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserStack = () => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { permissionStatus } = useSelector(
    (state: RootState) => state.appSlice
  );

  useEffect(() => {
    const fetchLocationPermissionStatus = async () => {
      const status = await getLocationPermissionStatus();
      if (status.granted) {
        const locObj = await getUserCoordinates();
        const geoResponse = await geoCodeAPI(
          `${locObj.coords.latitude},${locObj.coords.longitude}`,
          true
        );
        dispatch(actionSetUserLocation(geoResponse));
      }
      dispatch(actionSetPermissionStatus(status));
    };
    fetchLocationPermissionStatus();
  }, []);

  if (permissionStatus == null)
    return (
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={"small"}
            color={theme.colors.core.primaryA}
          />
        </View>
      </ScreenWrapper>
    );

  if (!permissionStatus.granted) {
    return (
      <Stack.Navigator
        initialRouteName="EnableLocationScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="EnableLocationScreen" component={EnableLocation} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerStack" component={DrawerStack} />
    </Stack.Navigator>
  );
};

export default UserStack;
