import {
  DimensionValue,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";

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
  /** For autofill: e.g. "emailAddress" | "password" | "newPassword". Helps avoid stuck fields when system autofills. */
  textContentType?: TextInputProps["textContentType"];
  /** For autofill: e.g. "email" | "password" | "new-password". Helps avoid stuck fields when system autofills. */
  autoComplete?: TextInputProps["autoComplete"];
  /** Additional TextInput props (e.g. textContentType, autoComplete for native autofill). */
  textInputProps?: Partial<TextInputProps>;
};
