import {
  SHOW_STATUS_MODAL_PROPS,
  T_APP_SLICE,
  T_INTENT_SEARCH_RESULT,
  T_LOCATION_PERMISSION,
  T_SEARCH_DATA,
} from "./types";
import { T_SEARCH_FIELDS } from "@/screens/search/types";
import { T_GEO_RESULT, T_GEOCODING_RESPONSE, T_USER } from "@/apis/types";

export const initialAppState: T_APP_SLICE = {
  initialLaunch: null,
  appLoading: false,
  showStatusModal: false,
  statusModal: "confirm",
  statusModalMessage:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  statusModalActionKey: null,
  showBiometricModal: false,
  createdSessionId: null,
  completeProfile: false,
  verificationNumber: null,
  searchForm: null,
  calendarEventIds: {},
  googlePlaceData: null,
  userLocation: null,
  permissionStatus: null,
  searchData: null,
  intentSearchResult: null,
  selectedFilters: [],
  currentUser: null,
  showQrModal: false,
  bookingId: null,
  isConcierge: false,
};

type T_APP_ACTION =
  | { type: "actionSetInitialLaunch"; payload: boolean | null }
  | { type: "actionSetAppLoading"; payload: boolean }
  | { type: "actionSetShowStatusModal"; payload: SHOW_STATUS_MODAL_PROPS }
  | { type: "actionSetCreatedSessionId"; payload: string | null }
  | { type: "actionSetCompleteProfile"; payload: boolean }
  | { type: "actionSetVerificationNumber"; payload: string | null }
  | { type: "actionSetSearchForm"; payload: T_SEARCH_FIELDS }
  | {
      type: "actionSetCalendarEventId";
      payload: { bookingId: string; eventId: string };
    }
  | { type: "actionSetShowBiometricModal"; payload: boolean }
  | { type: "actionSetGooglePlaceData"; payload: T_GEO_RESULT | null }
  | { type: "actionSetUserLocation"; payload: T_GEOCODING_RESPONSE | null }
  | { type: "actionSetPermissionStatus"; payload: T_LOCATION_PERMISSION | null }
  | { type: "actionSetSearchData"; payload: T_SEARCH_DATA | null }
  | { type: "actionSetIntentSearchResult"; payload: T_INTENT_SEARCH_RESULT | null }
  | { type: "actionSetSelectedFilters"; payload: string[] }
  | { type: "actionSetCurrentUser"; payload: T_USER | null }
  | { type: "actionSetShowQRModal"; payload: boolean }
  | { type: "actionSetBookingId"; payload: string | null }
  | { type: "actionSetIsConcierge"; payload: boolean };

export const appReducer = (state: T_APP_SLICE, action: T_APP_ACTION): T_APP_SLICE => {
  switch (action.type) {
    case "actionSetInitialLaunch":
      return { ...state, initialLaunch: action.payload };
    case "actionSetAppLoading":
      return { ...state, appLoading: action.payload };
    case "actionSetShowStatusModal":
      return {
        ...state,
        showStatusModal: action.payload.showStatusModal,
        statusModal: action.payload.type,
        statusModalMessage: action.payload.statusModalMessage,
        statusModalActionKey: action.payload.actionKey ?? null,
      };
    case "actionSetCreatedSessionId":
      return { ...state, createdSessionId: action.payload };
    case "actionSetCompleteProfile":
      return { ...state, completeProfile: action.payload };
    case "actionSetVerificationNumber":
      return { ...state, verificationNumber: action.payload };
    case "actionSetSearchForm":
      return { ...state, searchForm: action.payload };
    case "actionSetCalendarEventId":
      return {
        ...state,
        calendarEventIds: {
          ...state.calendarEventIds,
          [action.payload.bookingId]: action.payload.eventId,
        },
      };
    case "actionSetShowBiometricModal":
      return { ...state, showBiometricModal: action.payload };
    case "actionSetGooglePlaceData":
      return { ...state, googlePlaceData: action.payload };
    case "actionSetUserLocation":
      return { ...state, userLocation: action.payload };
    case "actionSetPermissionStatus":
      return { ...state, permissionStatus: action.payload };
    case "actionSetSearchData":
      return { ...state, searchData: action.payload };
    case "actionSetIntentSearchResult":
      return { ...state, intentSearchResult: action.payload };
    case "actionSetSelectedFilters":
      return { ...state, selectedFilters: action.payload };
    case "actionSetCurrentUser":
      return { ...state, currentUser: action.payload };
    case "actionSetShowQRModal":
      return { ...state, showQrModal: action.payload };
    case "actionSetBookingId":
      return { ...state, bookingId: action.payload };
    case "actionSetIsConcierge":
      return { ...state, isConcierge: action.payload };
    default:
      return state;
  }
};

export const actionSetInitialLaunch = (payload: boolean | null): T_APP_ACTION => ({
  type: "actionSetInitialLaunch",
  payload,
});
export const actionSetAppLoading = (payload: boolean): T_APP_ACTION => ({
  type: "actionSetAppLoading",
  payload,
});
export const actionSetShowStatusModal = (
  payload: SHOW_STATUS_MODAL_PROPS
): T_APP_ACTION => ({
  type: "actionSetShowStatusModal",
  payload,
});
export const actionSetCreatedSessionId = (payload: string | null): T_APP_ACTION => ({
  type: "actionSetCreatedSessionId",
  payload,
});
export const actionSetCompleteProfile = (payload: boolean): T_APP_ACTION => ({
  type: "actionSetCompleteProfile",
  payload,
});
export const actionSetVerificationNumber = (payload: string | null): T_APP_ACTION => ({
  type: "actionSetVerificationNumber",
  payload,
});
export const actionSetSearchForm = (payload: T_SEARCH_FIELDS): T_APP_ACTION => ({
  type: "actionSetSearchForm",
  payload,
});
export const actionSetCalendarEventId = (payload: {
  bookingId: string;
  eventId: string;
}): T_APP_ACTION => ({
  type: "actionSetCalendarEventId",
  payload,
});
export const actionSetShowBiometricModal = (payload: boolean): T_APP_ACTION => ({
  type: "actionSetShowBiometricModal",
  payload,
});
export const actionSetGooglePlaceData = (
  payload: T_GEO_RESULT | null
): T_APP_ACTION => ({
  type: "actionSetGooglePlaceData",
  payload,
});
export const actionSetUserLocation = (
  payload: T_GEOCODING_RESPONSE | null
): T_APP_ACTION => ({
  type: "actionSetUserLocation",
  payload,
});
export const actionSetPermissionStatus = (
  payload: T_LOCATION_PERMISSION | null
): T_APP_ACTION => ({
  type: "actionSetPermissionStatus",
  payload,
});
export const actionSetSearchData = (payload: T_SEARCH_DATA | null): T_APP_ACTION => ({
  type: "actionSetSearchData",
  payload,
});
export const actionSetIntentSearchResult = (
  payload: T_INTENT_SEARCH_RESULT | null
): T_APP_ACTION => ({
  type: "actionSetIntentSearchResult",
  payload,
});
export const actionSetSelectedFilters = (payload: string[]): T_APP_ACTION => ({
  type: "actionSetSelectedFilters",
  payload,
});
export const actionSetCurrentUser = (payload: T_USER | null): T_APP_ACTION => ({
  type: "actionSetCurrentUser",
  payload,
});
export const actionSetShowQRModal = (payload: boolean): T_APP_ACTION => ({
  type: "actionSetShowQRModal",
  payload,
});
export const actionSetBookingId = (payload: string | null): T_APP_ACTION => ({
  type: "actionSetBookingId",
  payload,
});
export const actionSetIsConcierge = (payload: boolean): T_APP_ACTION => ({
  type: "actionSetIsConcierge",
  payload,
});
