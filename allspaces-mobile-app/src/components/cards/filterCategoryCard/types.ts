import { T_FILTER_CATEGORY, T_FILTER_SUBCATEGORY } from "@/apis/types";

export type T_FILTER_CATEGORY_CARD = {
  categoryItem: T_FILTER_CATEGORY;
  selectedCategoryItems: string[];
  onSubCategoryPress: (subcategory: T_FILTER_SUBCATEGORY) => void;
};
