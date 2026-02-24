import { configureStore } from "@reduxjs/toolkit";

import AppSlice from "./app.slice";
import { apiCalls } from "@/apis/apiSlice";

export const store = configureStore({
  reducer: {
    [apiCalls.reducerPath]: apiCalls.reducer,
    appSlice: AppSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiCalls.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
