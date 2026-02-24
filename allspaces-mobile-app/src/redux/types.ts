import { T_GEO_RESULT, T_GEOCODING_RESPONSE, T_USER } from "@/apis/types";
import { T_SEARCH_FIELDS } from "@/screens/search/types";
import { GestureResponderEvent } from "react-native";
import * as ExpoLocation from "expo-location";

export type T_STATUS_MODAL_TYPES = "success" | "error" | "warning" | "confirm";
export type T_SEARCH_DATA = {
  date: string;
  duration: number;
  noOfGuests: number;
  location: string;
  filters: string[];
};
export type T_APP_SLICE = {
  initialLaunch: boolean | null;
  appLoading: boolean;
  showStatusModal: boolean;
  statusModal: T_STATUS_MODAL_TYPES;
  statusModalMessage: string;
  statusModalOkayPress: ((event: GestureResponderEvent) => void) | undefined;
  statusModalConfirmPress: ((event: GestureResponderEvent) => void) | undefined;
  showBiometricModal: boolean;
  createdSessionId: string | null;
  completeProfile: boolean;
  verificationNumber: string | null;
  searchForm: T_SEARCH_FIELDS | null;
  calendarEventIds: Record<string, string>;
  googlePlaceData: T_GEO_RESULT | null;
  userLocation: T_GEOCODING_RESPONSE | null;
  permissionStatus: ExpoLocation.PermissionResponse | null;
  searchData: T_SEARCH_DATA | null;
  selectedFilters: string[];
  currentUser: T_USER | null;
  showQrModal: boolean;
  bookingId: string | null;
};

export type SHOW_STATUS_MODAL_PROPS = {
  showStatusModal: boolean;
  type: T_STATUS_MODAL_TYPES;
  statusModalMessage: string;
  onConfirmClick?: ((event: GestureResponderEvent) => void) | undefined;
  onOkayClick?: ((event: GestureResponderEvent) => void) | undefined;
};
