import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SHOW_STATUS_MODAL_PROPS, T_APP_SLICE, T_SEARCH_DATA } from "./types";
import { T_SEARCH_FIELDS } from "@/screens/search/types";
import { T_GEO_RESULT, T_GEOCODING_RESPONSE, T_USER } from "@/apis/types";
import * as ExpoLocation from "expo-location";

const initialState: T_APP_SLICE = {
  initialLaunch: null,
  appLoading: false,
  showStatusModal: false,
  statusModal: "confirm",
  statusModalMessage:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  statusModalConfirmPress: undefined,
  statusModalOkayPress: undefined,
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
  selectedFilters: [],
  currentUser: null,
  showQrModal: false,
  bookingId: null,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    actionSetInitialLaunch: (state, action: PayloadAction<boolean | null>) => {
      state.initialLaunch = action.payload;
    },
    actionSetAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    actionSetShowStatusModal: (
      state,
      action: PayloadAction<SHOW_STATUS_MODAL_PROPS>
    ) => {
      state.showStatusModal = action.payload.showStatusModal;
      state.statusModal = action.payload.type;
      state.statusModalMessage = action.payload.statusModalMessage;
      state.statusModalConfirmPress = action.payload.onConfirmClick;
      state.statusModalOkayPress = action.payload.onOkayClick;
    },
    actionSetCreatedSessionId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.createdSessionId = action.payload;
    },
    actionSetCompleteProfile: (state, action: PayloadAction<boolean>) => {
      state.completeProfile = action.payload;
    },
    actionSetVerificationNumber: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.verificationNumber = action.payload;
    },
    actionSetSearchForm: (state, action: PayloadAction<T_SEARCH_FIELDS>) => {
      state.searchForm = action.payload;
    },
    actionSetCalendarEventId: (
      state,
      action: PayloadAction<{ bookingId: string; eventId: string }>
    ) => {
      state.calendarEventIds[action.payload.bookingId] = action.payload.eventId;
    },
    actionSetShowBiometricModal: (state, action: PayloadAction<boolean>) => {
      state.showBiometricModal = action.payload;
    },
    actionSetGooglePlaceData: (
      state,
      action: PayloadAction<T_GEO_RESULT | null>
    ) => {
      console.log('Setting Google Place Data:', action.payload);
      state.googlePlaceData = action.payload;
    },
    actionSetUserLocation: (
      state,
      action: PayloadAction<T_GEOCODING_RESPONSE | null>
    ) => {
      state.userLocation = action.payload;
    },
    actionSetPermissionStatus: (
      state,
      action: PayloadAction<ExpoLocation.PermissionResponse | null>
    ) => {
      state.permissionStatus = action.payload;
    },
    actionSetSearchData: (
      state,
      action: PayloadAction<T_SEARCH_DATA | null>
    ) => {
      state.searchData = action.payload;
    },
    actionSetSelectedFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedFilters = action.payload;
    },
    actionSetCurrentUser: (state, action: PayloadAction<T_USER | null>) => {
      state.currentUser = action.payload;
    },
    actionSetShowQRModal: (state, action: PayloadAction<boolean>) => {
      state.showQrModal = action.payload;
    },
    actionSetBookingId: (state, action: PayloadAction<string | null>) => {
      state.bookingId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  actionSetAppLoading,
  actionSetInitialLaunch,
  actionSetShowStatusModal,
  actionSetCreatedSessionId,
  actionSetCompleteProfile,
  actionSetVerificationNumber,
  actionSetSearchForm,
  actionSetCalendarEventId,
  actionSetShowBiometricModal,
  actionSetGooglePlaceData,
  actionSetUserLocation,
  actionSetPermissionStatus,
  actionSetSearchData,
  actionSetSelectedFilters,
  actionSetCurrentUser,
  actionSetShowQRModal,
  actionSetBookingId,
} = appSlice.actions;

export default appSlice.reducer;
