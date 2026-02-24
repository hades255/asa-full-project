import { View, Text } from "react-native";
import React, { useState } from "react";
import { T_APP_FILTERS } from "./types";
import { useGetProfileFiltersAPI } from "@/apis";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import FilterCategoryCard from "../cards/filterCategoryCard";
import { T_FILTER_SUBCATEGORY } from "@/apis/types";

const AppFilters: React.FC<T_APP_FILTERS> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { theme } = useUnistyles();
  const { data, isLoading } = useGetProfileFiltersAPI();
  const onSubCategoryPress = (subCatItem: T_FILTER_SUBCATEGORY) => {
    const itemFound = selectedCategories.find((item) => item === subCatItem.id);
    if (itemFound) {
      setSelectedCategories((prev) =>
        prev.filter((item) => item != subCatItem.id)
      );
    } else {
      setSelectedCategories((prev) => [...prev, subCatItem.id]);
    }
  };
  
  return (
    <View style={styles.mainContainer}>
      <View style={{ rowGap: theme.units[4], paddingBottom: 100 }}>
        {data?.filters.categories?.map((item, index) => (
          <View key={item.id}>
            <FilterCategoryCard
              categoryItem={item}
              onSubCategoryPress={onSubCategoryPress}
              selectedCategoryItems={selectedCategories}
            />
            {index < (data?.filters.categories?.length || 0) - 1 && (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: theme.colors.core.accent,
                  opacity: 0.3,
                  marginTop: theme.units[6],
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default AppFilters;
