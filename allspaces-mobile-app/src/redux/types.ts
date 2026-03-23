import { T_GEO_RESULT, T_GEOCODING_RESPONSE, T_USER } from "@/apis/types";
import { T_SEARCH_FIELDS } from "@/screens/search/types";

export type T_STATUS_MODAL_TYPES = "success" | "error" | "warning" | "confirm";
export type T_LOCATION_PERMISSION = {
  granted: boolean;
  canAskAgain: boolean;
};

export type T_SEARCH_DATA = {
  date: string;
  duration: number;
  noOfGuests: number;
  location: string;
  filters: string[];
};

export type T_INTENT_SEARCH_RESULT = {
  prompt?: string;
  recommendations?: Array<{
    profile: Record<string, unknown>;
    score?: number;
    reasons?: string[];
  }>;
  summary?: string;
  intent?: unknown;
  noMatchMessage?: string;
  candidatesCount?: number;
  error?: string;
};

export type T_APP_SLICE = {
  initialLaunch: boolean | null;
  appLoading: boolean;
  showStatusModal: boolean;
  statusModal: T_STATUS_MODAL_TYPES;
  statusModalMessage: string;
  statusModalActionKey: string | null;
  showBiometricModal: boolean;
  createdSessionId: string | null;
  completeProfile: boolean;
  verificationNumber: string | null;
  searchForm: T_SEARCH_FIELDS | null;
  calendarEventIds: Record<string, string>;
  googlePlaceData: T_GEO_RESULT | null;
  userLocation: T_GEOCODING_RESPONSE | null;
  permissionStatus: T_LOCATION_PERMISSION | null;
  searchData: T_SEARCH_DATA | null;
  intentSearchResult: T_INTENT_SEARCH_RESULT | null;
  selectedFilters: string[];
  currentUser: T_USER | null;
  showQrModal: boolean;
  bookingId: string | null;
  isConcierge: boolean;
};

export type SHOW_STATUS_MODAL_PROPS = {
  showStatusModal: boolean;
  type: T_STATUS_MODAL_TYPES;
  statusModalMessage: string;
  actionKey?: string | null;
};
