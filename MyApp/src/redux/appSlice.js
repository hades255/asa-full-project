import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchData: null,
  googlePlaceData: null,
  selectedFilters: [],
  intentSearchResult: null,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    actionSetSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    actionSetIntentSearchResult: (state, action) => {
      state.intentSearchResult = action.payload;
    },
    actionSetGooglePlaceData: (state, action) => {
      state.googlePlaceData = action.payload;
    },
    actionSetSelectedFilters: (state, action) => {
      state.selectedFilters = action.payload;
    },
  },
});

export const {
  actionSetSearchData,
  actionSetGooglePlaceData,
  actionSetSelectedFilters,
  actionSetIntentSearchResult,
} = appSlice.actions;

export default appSlice.reducer;
