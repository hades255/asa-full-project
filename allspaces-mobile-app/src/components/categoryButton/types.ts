export type T_CATEGORY_BUTTON = {
  item: {
    id: string;
    label: string;
  };
  selectedFilter: string;
  setSelectedFilter: (id: string) => void;
};
