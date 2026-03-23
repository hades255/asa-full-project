import React, { createContext, useContext, useMemo, useReducer } from "react";
import { appReducer, initialAppState } from "./app.slice";
import { T_APP_SLICE } from "./types";

type T_REDUX_STATE = {
  appSlice: T_APP_SLICE;
};

type T_APP_CONTEXT = {
  state: T_REDUX_STATE;
  dispatch: React.Dispatch<any>;
};

const AppStateContext = createContext<T_APP_CONTEXT | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appSlice, dispatch] = useReducer(appReducer, initialAppState);
  const value = useMemo(() => ({ state: { appSlice }, dispatch }), [appSlice]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppStateContext = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppStateContext must be used within AppStateProvider");
  }
  return ctx;
};
