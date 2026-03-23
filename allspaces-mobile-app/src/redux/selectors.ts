import { RootState } from "./store";

export const selectAppSlice = (state: RootState) => state.appSlice;

export const selectAppLoading = (state: RootState) => selectAppSlice(state).appLoading;

export const selectStatusModalState = (state: RootState) => {
  const app = selectAppSlice(state);
  return {
  showStatusModal: app.showStatusModal,
  statusModal: app.statusModal,
  statusModalMessage: app.statusModalMessage,
  statusModalActionKey: app.statusModalActionKey,
  };
};

export const selectCompleteProfile = (state: RootState) =>
  selectAppSlice(state).completeProfile;

export const selectCurrentUser = (state: RootState) => selectAppSlice(state).currentUser;

export const selectSelectedFilters = (state: RootState) =>
  selectAppSlice(state).selectedFilters;

export const selectGooglePlaceData = (state: RootState) =>
  selectAppSlice(state).googlePlaceData;

export const selectUserLocation = (state: RootState) => selectAppSlice(state).userLocation;

export const selectPermissionStatus = (state: RootState) =>
  selectAppSlice(state).permissionStatus;

export const selectCalendarEventIds = (state: RootState) =>
  selectAppSlice(state).calendarEventIds;
