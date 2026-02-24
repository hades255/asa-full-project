import React, { SetStateAction } from "react";

export type T_APP_FILTERS = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<SetStateAction<string[]>>;
};
