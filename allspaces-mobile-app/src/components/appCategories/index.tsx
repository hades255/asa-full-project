import { View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { T_APP_CATEGORIES } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { Image } from "expo-image";
import { styles } from "./styles";
import AppText from "../appText";
import { useGetCategoriesAPI } from "@/apis";
import Chip from "../chip";
import { useUnistyles } from "react-native-unistyles";
import { T_CATEGORY_ITEM } from "@/apis/types";
import { useNavigation } from "@react-navigation/native";

const AppCategories: React.FC<T_APP_CATEGORIES> = ({ isChip, withAll }) => {
  const { data: categories } = useGetCategoriesAPI();
  const navigation = useNavigation();
  const { theme } = useUnistyles();

  useEffect(() => {
    if (categories?.length && withAll && isChip) {
      categories.unshift({
        id: "all-services",
        image: "",
        parentId: null,
        title: "All",
        type: "all",
      });
      setSelectedId(categories[0]);
    }
  }, [categories]);

  const [selectedId, setSelectedId] = useState<T_CATEGORY_ITEM | null>(null);

  return (
    <View style={{ rowGap: theme.units[3] }}>
      <AppText
        font="heading3"
        color={theme.colors.semantic.content.contentPrimary}
        style={{
          marginLeft: theme.units[5],
        }}
      >{`Choose Service`}</AppText>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.mainContainer}
        renderItem={({ item }) =>
          isChip ? (
            <Chip
              text={item.title.split(" ")[0]}
              isSelected={item.id === selectedId?.id}
              onPress={() => {
                setSelectedId(item);
              }}
            />
          ) : (
            <ButtonWrapper
              onPress={() => {
                // @ts-ignore
                navigation.navigate("SearchScreen");
              }}
              otherProps={{
                style: styles.itemContainer,
              }}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={{ uri: item.mobileImage }}
                  style={styles.imgStyle}
                  contentFit="cover"
                  contentPosition={"center"}
                />
              </View>
              <AppText font="caption1">{item.title.split(" ")[0]}</AppText>
            </ButtonWrapper>
          )
        }
      />
    </View>
  );
};

export default AppCategories;
