import { T_SCAN_DETAILS_SCREEN_ROUTE_PARAMS } from "@/screens/concierge/scanDetails/types";
import { T_SCANNING_SCREEN_ROUTE_PARAMS } from "@/screens/concierge/scanning/types";

export type ConciergeStackParamList = {
  ScanningScreen: T_SCANNING_SCREEN_ROUTE_PARAMS;
  ScanDetailsScreen: T_SCAN_DETAILS_SCREEN_ROUTE_PARAMS;
};
