import { UserStackParamList } from "@/navigation/userStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ExpoLocation from "expo-location";
export type T_DENIED_LOCATION_SCREEN = NativeStackScreenProps<
  UserStackParamList,
  "DeniedLocationScreen"
>;

export type T_DENIED_LOCATION_SCREEN_ROUTE_PARAMS = {
  permissionStatus: ExpoLocation.PermissionResponse | null;
  setPermissionStatus: React.Dispatch<
    React.SetStateAction<ExpoLocation.PermissionResponse | null>
  >;
};
