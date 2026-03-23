import React, { useCallback, useMemo } from "react";
import { T_FAVOURITES_SCREEN } from "./types";
import { EmptyList, Header1, ScreenWrapper, SpaceCard } from "@/components";
import { View, RefreshControl } from "react-native";
import { styles } from "./styles";
import { useGetWishlists } from "@/apis";
import { useUnistyles } from "react-native-unistyles";
import { FlashList } from "@shopify/flash-list";

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

  const wishlists = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const listContentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: theme.units[4],
      paddingBottom: theme.units[6],
      paddingTop: theme.units[6],
    }),
    [theme.units]
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    return <SpaceCard space={item.profile} fullWidth />;
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  const renderSeparator = useCallback(
    () => <View style={{ height: theme.units[4] }} />,
    [theme.units]
  );

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Wishlist" />
      <View style={styles.mainContainer}>
        <View style={styles.listContainer}>
          <FlashList
            estimatedItemSize={236}
            showsVerticalScrollIndicator={false}
            data={wishlists}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                colors={[theme.colors.core.accent]}
                tintColor={theme.colors.core.accent}
                titleColor={theme.colors.core.accent}
              />
            }
            contentContainerStyle={listContentContainerStyle}
            ListEmptyComponent={
              <EmptyList message="Your wishlist is empty. Start exploring and save your favourite spaces!" />
            }
            renderItem={renderItem}
            ItemSeparatorComponent={renderSeparator}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            keyExtractor={keyExtractor}
            removeClippedSubviews
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Favourites;
