import { DimensionValue, KeyboardTypeOptions } from "react-native";

export type T_APP_INPUT = {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  width?: DimensionValue;
  isPassword?: boolean;
  KeyboardType?: KeyboardTypeOptions;
  control: any;
  name: string;
  error?: string;
  isTextbox?: boolean;
};
