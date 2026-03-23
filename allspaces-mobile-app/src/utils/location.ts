import { T_GEOCODING_RESPONSE } from "@/apis/types";
import axios from "axios";
import * as ExpoLocation from "expo-location";
import { envConfig } from "./envConfig";

export const getLocationPermissionStatus = async () => {
  try {
    return await ExpoLocation.getForegroundPermissionsAsync();
  } catch (error) {
    throw error;
  }
};

export const requestLocationPermission = async () => {
  try {
    return await ExpoLocation.requestForegroundPermissionsAsync();
  } catch (error) {
    throw error;
  }
};

export const getUserCoordinates = async () => {
  try {
    return await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.Balanced,
    });
  } catch (error) {
    throw error;
  }
};

export const geoCodeAPI = async (
  data: string,
  isReverse?: boolean,
): Promise<T_GEOCODING_RESPONSE | null> => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envConfig.EXPO_PUBLIC_GOOGLE_API_URL}/geocode/json?${
        isReverse ? "latlng" : "address"
      }=${data}&key=${envConfig.EXPO_PUBLIC_GOOGLE_KEY}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
