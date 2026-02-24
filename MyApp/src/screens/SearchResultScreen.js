import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useSearchProfilesAPI } from "../apis/useSearchProfiles";
import ScreenWrapper from "../components/ScreenWrapper";
import Header2 from "../components/Header2";
import SpaceCard from "../components/SpaceCard";

const LIMIT = 10;

export default function SearchResultScreen({ navigation }) {
  const { searchData, googlePlaceData } = useSelector((state) => state.appSlice);

  const location = googlePlaceData?.geometry?.location
    ? {
        lat: googlePlaceData.geometry.location.lat,
        lng: googlePlaceData.geometry.location.lng,
      }
    : undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending,
  } = useSearchProfilesAPI(LIMIT, location, searchData?.filters);

  const profiles = data?.pages?.flatMap((p) => p.data || []) ?? [];

  if (!googlePlaceData) {
    return (
      <ScreenWrapper>
        <Header2 title="Search Results" />
        <View style={styles.center}>
          <Text style={styles.message}>
            Please go back and select a location.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const renderItem = ({ item }) => {
    if (item.source === "SPACE" || !item.source) {
      return (
        <SpaceCard
          space={item}
          fullWidth
          onPress={() => {
            navigation.navigate("SpaceDetail", { profile: item });
          }}
        />
      );
    }
    return (
      <View style={styles.otherCard}>
        <Text style={styles.otherTitle}>{item.hotel?.name || item.name || "Space"}</Text>
      </View>
    );
  };

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Search Results" />
      {isPending ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1a1a2e" />
          <Text style={styles.loadingText}>Loading spaces...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={profiles}
            keyExtractor={(item, i) => item?.id || i.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={["#1a1a2e"]}
                tintColor="#1a1a2e"
              />
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No spaces found</Text>
              </View>
            }
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: "#666",
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  otherCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
  },
  otherTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
