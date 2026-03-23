import { T_APP_SLICE } from "./types";

export type RootState = {
  appSlice: T_APP_SLICE;
};

export type AppDispatch = (action: any) => void;
