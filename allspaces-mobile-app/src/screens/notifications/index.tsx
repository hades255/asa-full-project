import { View, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { T_NOTIFICATIONS_SCREEN } from "./types";
import { Header1, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import NotificationItem from "@/components/notificationItem";
import { useGetNotificationsQuery } from "@/apis/apiSlice";
import { useUnistyles } from "react-native-unistyles";
import { useGetNotificationsAPI } from "@/apis";

const Notifications: React.FC<T_NOTIFICATIONS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();

  const {
    data: notifications,
    isPending,
    refetch,
    isRefetching,
  } = useGetNotificationsAPI();

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header1 title="Notifications" />
      <View style={styles.mainContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.semanticExtensions.content.contentAccent]}
              tintColor={theme.colors.semanticExtensions.content.contentAccent}
            />
          }
          data={notifications}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <NotificationItem
              isRead={item.isRead}
              description={item.message}
              time={item.createdAt}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;
