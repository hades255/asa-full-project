import { NativeSyntheticEvent } from "react-native";

export type T_COUNTRY_ITEM = {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
};

export type T_COUNTRY_PICKER_MODAL = {
  visible: boolean;
  selectedCountry: T_COUNTRY_ITEM;
  onCountrySelect: (country: T_COUNTRY_ITEM) => void;
  onRequestClose?: ((event: NativeSyntheticEvent<any>) => void) | undefined;
};
