import { T_PREFERENCES_ITEM, T_SUB_PREFERENCE_ITEM } from "@/apis/types";

export type T_PREF_CARD = {
  prefItem: T_PREFERENCES_ITEM;
  selectedPrefItems: string[];
  onPrefCardPress: (subPrefItem: T_SUB_PREFERENCE_ITEM) => void;
};
