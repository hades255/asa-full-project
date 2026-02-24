import { DimensionValue } from "react-native";

export type T_COUNTRY_ITEM = {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
};

export type T_APP_PHONE_INPUT = {
  control: any;
  name: string;
  error?: string;
  label?: string;
  placeholder?: string;
  width?: DimensionValue;
  onChangeText: (isValid: boolean) => void;
};
