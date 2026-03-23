import { View, Text, FlatList } from "react-native";
import React, { useCallback } from "react";
import { T_SEARCH_FILTERS_SCREEN } from "./types";
import { styles } from "./styles";
import {
  AppButton,
  AppLoader,
  Header2,
  IconButton,
  PrefCard,
} from "@/components";
import { useUnistyles } from "react-native-unistyles";
import { CloseCircle } from "iconsax-react-native";
import { useGetPreferencesAPI } from "@/apis";
import { useDispatch, useSelector } from "@/redux/hooks";
import { actionSetSelectedFilters } from "@/redux/app.slice";
import { useQueryClient } from "@tanstack/react-query";
import { selectSelectedFilters } from "@/redux/selectors";

const SearchFilters: React.FC<T_SEARCH_FILTERS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const { data: filters, isLoading } = useGetPreferencesAPI();
  const dispatch = useDispatch();
  const selectedFilters = useSelector(selectSelectedFilters);

  const onFilterClick = useCallback((filterItemId: any) => {
    const itemFound = selectedFilters.find((item) => item === filterItemId);
    if (itemFound) {
      dispatch(
        actionSetSelectedFilters(
          selectedFilters.filter((item: any) => item != filterItemId)
        )
      );
    } else {
      dispatch(actionSetSelectedFilters([...selectedFilters, filterItemId]));
    }
  }, [dispatch, selectedFilters]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <PrefCard
        prefItem={item}
        selectedPrefItems={selectedFilters}
        onPrefCardPress={onFilterClick}
      />
    ),
    [onFilterClick, selectedFilters]
  );

  return (
    <View style={styles.mainContainer}>
      <Header2
        title="Filters"
        renderLeft={
          <IconButton
            onPress={() => {
              navigation.goBack();
            }}
            icon={
              <CloseCircle
                color={theme.colors.semantic.content.contentPrimary}
                size={24}
                variant="Linear"
              />
            }
          />
        }
      />
      {!isLoading &&
        filters &&
        filters.data &&
        filters.data.length > 0 && (
          <View style={styles.listContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filters.data}
              keyExtractor={keyExtractor}
              contentContainerStyle={{ rowGap: theme.units[4] }}
              renderItem={renderItem}
            />
          </View>
        )}
      <View style={styles.action}>
        <AppButton
          title="Apply Filters"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <AppLoader visible={isLoading} />
    </View>
  );
};

export default SearchFilters;
