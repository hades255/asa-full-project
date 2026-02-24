import { ConciergeStackParamList } from "@/navigation/conciergeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BarcodeScanningResult } from "expo-camera";

export type T_SCAN_DETAILS_SCREEN = NativeStackScreenProps<
  ConciergeStackParamList,
  "ScanDetailsScreen"
>;
export type T_SCAN_DETAILS_SCREEN_ROUTE_PARAMS = {
  scanResult: BarcodeScanningResult;
};
