import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";

import { AccorCard, Header2, ScreenWrapper, SpaceCard } from "@/components";
import { styles } from "./styles";
import { T_SEARCH_RESULT_SCREEN } from "./types";
import { useUnistyles } from "react-native-unistyles";
import { useSearchProfilesAPI } from "@/apis";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { T_ACCOR_ITEM } from "@/apis/types";
import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";

const LIMIT = 10;

const SearchResultScreen: React.FC<T_SEARCH_RESULT_SCREEN> = ({
  navigation,
  route,
}) => {
  const { searchData, googlePlaceData } = useSelector(
    (state: RootState) => state.appSlice
  );
  const { theme } = useUnistyles();

  if (!googlePlaceData) return null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending,
  } = useSearchProfilesAPI(
    LIMIT,
    googlePlaceData
      ? {
          lat: googlePlaceData.geometry.location.lat,
          lng: googlePlaceData.geometry.location.lng,
        }
      : undefined,
    searchData?.filters
  );

  const profiles = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Search Results" />
      {isPending ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={"small"} color={theme.colors.core.accent} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.resultList}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  colors={[theme.colors.core.accent]}
                  tintColor={theme.colors.core.accent}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultListScroll}
              data={profiles}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                item.source === "SPACE" ? (
                  <SpaceCard
                    space={item as T_PROFILE_ITEM}
                    fullWidth
                    onPress={() => {
                      navigation.navigate("BookingDetailScreen", {
                        profile: item as T_PROFILE_ITEM,
                      });
                    }}
                  />
                ) : (
                  <AccorCard
                    item={item as T_ACCOR_ITEM}
                    onPress={() => {
                      navigation.navigate("AccorDetailScreen", {
                        profile: item as T_ACCOR_ITEM,
                      });
                    }}
                  />
                )
              }
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default SearchResultScreen;
