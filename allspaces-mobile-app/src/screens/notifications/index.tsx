import { View, RefreshControl } from "react-native";
import React, { useCallback } from "react";
import { T_NOTIFICATIONS_SCREEN } from "./types";
import { EmptyList, Header1, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import NotificationItem from "@/components/notificationItem";
import { useUnistyles } from "react-native-unistyles";
import { useGetNotificationsAPI } from "@/apis";
import { FlashList } from "@shopify/flash-list";

const Notifications: React.FC<T_NOTIFICATIONS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();

  const {
    data: notifications,
    isPending,
    refetch,
    isRefetching,
  } = useGetNotificationsAPI();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const keyExtractor = useCallback(
    (item: any, index: number) => item.id ?? `notification-${index}`,
    []
  );

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <NotificationItem
        isRead={item.isRead}
        description={item.message}
        time={item.createdAt}
      />
    );
  }, []);

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Notifications" />
      <View style={styles.mainContainer}>
        <FlashList
          estimatedItemSize={92}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={[theme.colors.semanticExtensions.content.contentAccent]}
              tintColor={theme.colors.semanticExtensions.content.contentAccent}
            />
          }
          data={[]}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <EmptyList message="No notifications yet. We'll notify you when something important happens!" />
          }
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: theme.units[3] }} />}
          removeClippedSubviews
        />
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;
