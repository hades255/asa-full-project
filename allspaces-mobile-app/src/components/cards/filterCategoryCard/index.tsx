import { View } from "react-native";
import React from "react";
import { T_FILTER_CATEGORY_CARD } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";

import AppText from "@/components/appText";
import { useUnistyles } from "react-native-unistyles";
import { Image } from "expo-image";
import { Add } from "iconsax-react-native";

const FilterCategoryCard: React.FC<T_FILTER_CATEGORY_CARD> = ({
  categoryItem,
  onSubCategoryPress,
  selectedCategoryItems,
}) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: categoryItem.image }}
            contentFit="contain"
            style={styles.iconStyle}
          />
        </View>
        <AppText font="button1">{categoryItem.title}</AppText>
      </View>
      <View style={styles.wrapContainer}>
        {categoryItem.subcategories.map((subCat) => {
          const isSelected = selectedCategoryItems.find(
            (item) => item === subCat.id
          );
          return (
            <ButtonWrapper
              key={subCat.id}
              onPress={() => {
                onSubCategoryPress(subCat);
              }}
              otherProps={{
                style: [
                  styles.chipContainer,
                  {
                    backgroundColor: !isSelected
                      ? theme.colors.semantic.background.backgroundSecondary
                      : theme.colors.semanticExtensions.background
                          .backgroundAccent,
                  },
                ],
              }}
            >
              {subCat.title === "Other" ? (
                <Add
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              ) : (
                <Image
                  source={{ uri: subCat.image }}
                  contentFit="contain"
                  style={styles.iconStyle}
                />
              )}
              <AppText
                font="caption1"
                color={theme.colors.semantic.content.contentPrimary}
              >
                {subCat.title}
              </AppText>
            </ButtonWrapper>
          );
        })}
      </View>
    </View>
  );
};

export default FilterCategoryCard;
