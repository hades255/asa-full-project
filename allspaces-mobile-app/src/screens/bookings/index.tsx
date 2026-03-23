import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { T_BOOKINGS_SCREEN } from "./types";
import {
  BookingCard,
  Chip,
  EmptyList,
  Header1,
  QrModal,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { useUser } from "@clerk/clerk-expo";

import { useDispatch } from "@/redux/hooks";
import { useGetBookingsAPI } from "@/apis";
import { useUnistyles } from "react-native-unistyles";
import { actionSetBookingId, actionSetShowQRModal } from "@/redux/app.slice";
import { FlashList } from "@shopify/flash-list";

const Bookings: React.FC<T_BOOKINGS_SCREEN> = ({ navigation }) => {
  const { user } = useUser();
  const { theme } = useUnistyles();
  const dispatch = useDispatch();

  const filters = useMemo(
    () => [
      {
        key: "all-bookings",
        title: `All Bookings`,
      },
      {
        key: "PENDING",
        title: `Pendings`,
      },
      {
        key: "APPROVED",
        title: `Approved`,
      },
      {
        key: "COMPLETED",
        title: `Completed`,
      },
      {
        key: "CANCELLED",
        title: `Cancelled`,
      },
    ],
    []
  );

  const [limit, setLimit] = useState(10);
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending,
  } = useGetBookingsAPI(
    limit,
    activeFilter.key === "all-bookings" ? undefined : activeFilter.key
  );

  const bookings = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  useEffect(() => {
    refetch();
  }, [activeFilter]);

  const keyExtractorFilter = useCallback((item: any) => item.key, []);
  const renderFilterItem = useCallback(
    ({ item }: { item: any }) => (
      <Chip
        text={item.title}
        isSelected={item.key === activeFilter.key}
        onPress={() => {
          setActiveFilter(item);
        }}
      />
    ),
    [activeFilter.key]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const keyExtractorBooking = useCallback((item: any) => item.id, []);

  const renderBookingItem = useCallback(
    ({ item }: { item: any }) => (
      <BookingCard
        booking={item}
        onScanPress={() => {
          dispatch(actionSetBookingId(item.id));
          setTimeout(() => {
            dispatch(actionSetShowQRModal(true));
          }, 500);
        }}
        onPress={() => {
          navigation.navigate("OrderDetailsScreen", { booking: item });
        }}
      />
    ),
    [dispatch, navigation]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const renderSeparator = useCallback(
    () => <View style={{ height: theme.units[4] }} />,
    [theme.units]
  );

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Bookings" />
      <QrModal />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filters}
        keyExtractor={keyExtractorFilter}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.filterList}
        renderItem={renderFilterItem}
      />
      <View style={styles.mainContainer}>
        {!isPending ? (
          <FlashList
            estimatedItemSize={180}
            showsVerticalScrollIndicator={false}
            data={bookings}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                colors={[theme.colors.core.accent]}
                tintColor={theme.colors.core.accent}
              />
            }
            keyExtractor={keyExtractorBooking}
            contentContainerStyle={{
              paddingHorizontal: theme.units[4],
              paddingVertical: theme.units[6],
            }}
            ListEmptyComponent={
              <EmptyList message="No bookings found. Start exploring spaces and make your first booking!" />
            }
            renderItem={renderBookingItem}
            ItemSeparatorComponent={renderSeparator}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
          />
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size={"small"}
              color={theme.colors.core.accent}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Bookings;
