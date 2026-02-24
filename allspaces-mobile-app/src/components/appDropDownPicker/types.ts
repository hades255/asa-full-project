import React from "react";

export type T_APP_DROPDOWN_PICKER = {
  label?: string;
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  icon?: React.ReactNode;
  onValueChange: (value: string) => void;
  name: string;
  control: any;
};
