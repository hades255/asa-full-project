import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { T_BOOKINGS_SCREEN } from "./types";
import {
  BookingCard,
  Chip,
  Header1,
  QrModal,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { useUser } from "@clerk/clerk-expo";

import { useDispatch } from "react-redux";
import { useGetBookingsAPI } from "@/apis";
import { useUnistyles } from "react-native-unistyles";
import { actionSetBookingId, actionSetShowQRModal } from "@/redux/app.slice";

const Bookings: React.FC<T_BOOKINGS_SCREEN> = ({ navigation }) => {
  const { user } = useUser();
  const { theme } = useUnistyles();
  const dispatch = useDispatch();

  const filters = [
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
  ];

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

  console.log("data", data);

  const bookings = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    refetch();
  }, [activeFilter]);

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Bookings" />
      <QrModal />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filters}
        keyExtractor={(item) => item.key}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.filterList}
        renderItem={({ item, index }) => (
          <Chip
            text={item.title}
            isSelected={item.key === activeFilter.key}
            onPress={() => {
              setActiveFilter(item);
            }}
          />
        )}
      />
      <View style={styles.mainContainer}>
        {!isPending && bookings?.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={bookings}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[theme.colors.core.accent]}
                tintColor={theme.colors.core.accent}
              />
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bookingsListScroll}
            renderItem={({ item }) => (
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
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
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
