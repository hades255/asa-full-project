import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchData: null,
  googlePlaceData: null,
  selectedFilters: [],
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    actionSetSearchData: (state, action) => {
      state.searchData = action.payload;
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
} = appSlice.actions;

export default appSlice.reducer;
