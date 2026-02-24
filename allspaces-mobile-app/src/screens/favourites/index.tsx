import React from "react";
import { T_FAVOURITES_SCREEN } from "./types";
import { Header1, ScreenWrapper, SpaceCard } from "@/components";
import { View, FlatList, RefreshControl } from "react-native";
import { styles } from "./styles";
import { useGetWishlists } from "@/apis";
import { useUnistyles } from "react-native-unistyles";

const LIMIT = 10;
const Favourites: React.FC<T_FAVOURITES_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending,
  } = useGetWishlists(LIMIT);

  const wishlists = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Wishlist" />
      <View style={styles.mainContainer}>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={wishlists}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[theme.colors.core.accent]}
                tintColor={theme.colors.core.accent}
                titleColor={theme.colors.core.accent}
              />
            }
            contentContainerStyle={{
              rowGap: theme.units[4],
              paddingHorizontal: theme.units[4],
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SpaceCard space={item.profile} fullWidth />
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Favourites;
