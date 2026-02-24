import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { T_CATEGORY_BUTTON } from "./types";
import { styles } from "./styles";
import { appColors } from "@/theme";

const CategoryButton: React.FC<T_CATEGORY_BUTTON> = ({
  item,
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedFilter(item.id)}
      style={[
        styles.filterItem,
        selectedFilter === item.id && {
          backgroundColor: appColors.semantic.content.contentPrimary,
        },
      ]}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === item.id && {
            color: appColors.semantic.background.backgroundPrimary,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryButton;
