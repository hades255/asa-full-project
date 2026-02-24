import { envConfig } from "@/utils/envConfig";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { T_GEOCODE_REPONSE } from "../types";

const googleApi = axios.create({
  baseURL: envConfig.EXPO_PUBLIC_GOOGLE_GEO_API,
  timeout: 30000,
  timeoutErrorMessage: `Request is timedout`,
});

export const GOOGLE_API_ROUTES = {
  GEO_CODE: `?address`,
  REVERSE_GEO_CODE: `?latlng`,
};

export const useGetGeocode = () => {
  return useMutation({
    mutationKey: [GOOGLE_API_ROUTES.GEO_CODE],
    mutationFn: async (address: string): Promise<T_GEOCODE_REPONSE> => {
      const response = await googleApi({
        method: "GET",
        params: {
          address: address,
          key: `${envConfig.EXPO_PUBLIC_GOOGLE_KEY}`,
        },
        url: ``,
      });
      return response.data;
    },
  });
};

export const useGetReverseGeocode = () => {
  return useMutation({
    mutationKey: [GOOGLE_API_ROUTES.REVERSE_GEO_CODE],
    mutationFn: async (data: {
      lat: number;
      lng: number;
    }): Promise<T_GEOCODE_REPONSE> => {
      const response = await googleApi({
        method: "GET",
        params: {
          latlng: `${data.lat},${data.lng}`,
          key: `${envConfig.EXPO_PUBLIC_GOOGLE_KEY}`,
        },
        url: ``,
      });
      return response.data;
    },
  });
};
