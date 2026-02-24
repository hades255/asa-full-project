import { DimensionValue } from "react-native";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type T_APP_DATE_PICKER<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder?: string;
  label?: string;
  error?: string;
  width?: DimensionValue;
  mode?: "date" | "time" | "datetime";
  disabled?: boolean;
};
