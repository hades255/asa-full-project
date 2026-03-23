import { View, ScrollView } from "react-native";
import React, { memo, useCallback } from "react";
import { T_APP_CATEGORIES } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { Image } from "expo-image";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { APP_CATEGORIES_DATA } from "./data";

type T_CATEGORY_UI_ITEM = (typeof APP_CATEGORIES_DATA)[number];
const CATEGORIES = APP_CATEGORIES_DATA;

const CategoryItem = memo(function CategoryItem({
  item,
  onPress,
}: {
  item: T_CATEGORY_UI_ITEM;
  onPress: () => void;
}) {
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.itemContainer,
      }}
    >
      <View style={styles.iconContainer}>
        <Image
          source={item.img}
          placeholder={item.blurhash}
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={item.key}
          style={styles.imgStyle}
          contentFit="cover"
          contentPosition={"center"}
        />
      </View>
      <AppText font="caption1" textAlign="center">{item.title}</AppText>
    </ButtonWrapper>
  );
});

const AppCategories: React.FC<T_APP_CATEGORIES> = ({ isChip, withAll }) => {
  const navigation = useNavigation();
  const { theme } = useUnistyles();

  const handleNavigateToSearch = useCallback(() => {
    // @ts-ignore
    navigation.navigate("SearchScreen");
  }, [navigation]);

  return (
    <View style={styles.mainWrapper}>
      <AppText
        font="heading3"
        color={theme.colors.semantic.content.contentPrimary}
        style={styles.title}
      >{`Choose Service`}</AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        bounces={false}
        overScrollMode="never"
      >
        {CATEGORIES.map((item: T_CATEGORY_UI_ITEM) => (
          <CategoryItem
            key={item.key}
            item={item}
            onPress={handleNavigateToSearch}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(AppCategories);
