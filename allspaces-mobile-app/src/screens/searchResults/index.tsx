import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo } from "react";

import {
  AccorCard,
  EmptyList,
  Header2,
  ScreenWrapper,
  SpaceCard,
  AppText,
  AppButton,
} from "@/components";
import { styles } from "./styles";
import { T_SEARCH_RESULT_SCREEN } from "./types";
import { useUnistyles } from "react-native-unistyles";
import { useSearchProfilesAPI } from "@/apis";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { T_ACCOR_ITEM } from "@/apis/types";
import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";
import { FlashList } from "@shopify/flash-list";

const LIMIT = 10;

const DEFAULT_COVER =
  "https://hips.hearstapps.com/hmg-prod/images/copy-of-del-social-index-image-69-66996ead71585.png?crop=0.8888888888888888xw:1xh;0,0";

function normalizeIntentProfile(rec: {
  profile?: Record<string, any>;
  score?: number;
}): T_PROFILE_ITEM {
  const p = rec?.profile ?? {};
  const services = Array.isArray(p?.services)
    ? p.services
    : [
        {
          minSpend: 0,
          name: "",
          id: "",
          description: "",
          subCategoryId: "",
          categoryId: "",
          media: "",
        },
      ];
  return {
    id: p?.id ?? "",
    name: p?.name ?? "Unnamed",
    description: p?.description ?? "",
    email: p?.email ?? "",
    location: p?.location ?? { lat: 0, lng: 0 },
    address:
      typeof p?.address === "string"
        ? p.address
        : typeof p?.location === "string"
        ? p.location
        : "No address",
    coverMedia: p?.coverMedia ?? p?.cover_media ?? DEFAULT_COVER,
    source: p?.source ?? "SPACE",
    averageRating: typeof p?.averageRating === "number" ? p.averageRating : 0,
    totalReviews: typeof p?.totalReviews === "number" ? p.totalReviews : 0,
    rating: p?.rating ?? {
      oneStarCount: 0,
      twoStarCount: 0,
      threeStarCount: 0,
      fourStarCount: 0,
      fiveStarCount: 0,
    },
    facilities: p?.facilities ?? [],
    services,
    reviews: p?.reviews ?? [],
    media: p?.media ?? [],
    isInWishlist: p?.isInWishlist ?? false,
    matchScore: typeof rec?.score === "number" ? rec.score : undefined,
  };
}

const SearchResultScreen: React.FC<T_SEARCH_RESULT_SCREEN> = ({
  navigation,
  route,
}) => {
  const { searchData, googlePlaceData, intentSearchResult } = useSelector(
    (state: RootState) => state.appSlice
  );
  const { theme } = useUnistyles();

  const hasIntentResults = Boolean(
    intentSearchResult && !intentSearchResult?.error
  );
  const intentRecommendations = intentSearchResult?.recommendations ?? [];
  const intentError = intentSearchResult?.error;
  const noMatchMessage = intentSearchResult?.noMatchMessage;

  const normalizedIntentProfiles = useMemo(
    () => intentRecommendations.map(normalizeIntentProfile),
    [intentRecommendations]
  );

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

  const legacyProfiles = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const profiles = hasIntentResults ? normalizedIntentProfiles : legacyProfiles;
  const useLegacyFlow = !hasIntentResults && !!googlePlaceData;
  const keyExtractor = useCallback((item: any, index: number) => {
    if (item?.id) return item.id;
    if (item?.profile?.id) return item.profile.id;
    return `${item?.source ?? "profile"}-${index}`;
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (useLegacyFlow && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [useLegacyFlow, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const renderSeparator = useCallback(
    () => <View style={{ height: theme.units[4] }} />,
    [theme.units]
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) =>
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
      ),
    [navigation]
  );

  // Intent flow (prompt/voice search) - same item style as legacy
  if (hasIntentResults || intentSearchResult) {
    const hasResults = normalizedIntentProfiles.length > 0;
    const searchPrompt = intentSearchResult?.prompt;
    return (
      <ScreenWrapper withoutBottomPadding>
        <Header2 title="Search Results" />
        {searchPrompt ? (
          <View style={styles.promptContainer}>
            <AppText
              font="body2"
              color={theme.colors.semantic.content.contentSecondary}
            >
              {`You searched: `}
              <AppText
                font="body2"
                color={theme.colors.semantic.content.contentPrimary}
              >
                {searchPrompt}
              </AppText>
            </AppText>
          </View>
        ) : null}
        <View style={styles.mainContainer}>
          {intentError && (
            <View style={{ padding: 16, marginHorizontal: theme.units[4] }}>
              <AppText
                font="body2"
                color={theme.colors.semanticExtensions.content.contentNegative}
              >
                {intentError}
              </AppText>
              <View style={{ marginTop: 16, alignSelf: "flex-start" }}>
                <AppButton
                  title="Try another search"
                  onPress={() => navigation.goBack()}
                  width={200}
                />
              </View>
            </View>
          )}
          {!hasResults && !intentError && (
            <View style={{ flex: 1, padding: 48, alignItems: "center" }}>
              <AppText
                font="body2"
                color={theme.colors.semantic.content.contentInverseTertionary}
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                {noMatchMessage || "No results found. Try another search."}
              </AppText>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  backgroundColor: theme.colors.core.accent,
                  borderRadius: 8,
                }}
                onPress={() => navigation.goBack()}
              >
                <AppText
                  font="button1"
                  color={theme.colors.semantic.content.contentInversePrimary}
                >
                  Try another search
                </AppText>
              </TouchableOpacity>
            </View>
          )}
          {hasResults && (
            <View style={styles.resultList}>
              <FlashList
                estimatedItemSize={236}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultListScroll}
                data={normalizedIntentProfiles}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                removeClippedSubviews
              />
            </View>
          )}
        </View>
      </ScreenWrapper>
    );
  }

  // No search data and no intent results
  if (!googlePlaceData) {
    return (
      <ScreenWrapper>
        <Header2 title="Search Results" />
        <View style={[styles.loaderContainer, { padding: 24 }]}>
          <AppText
            font="body2"
            color={theme.colors.semantic.content.contentInverseTertionary}
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            Run a search first to see results.
          </AppText>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: theme.colors.core.accent,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <AppText
              font="button1"
              color={theme.colors.semantic.content.contentInversePrimary}
            >
              Back to Search
            </AppText>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // Legacy flow (filter search from SearchScreen)
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
            <FlashList
              estimatedItemSize={236}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.core.accent]}
                  tintColor={theme.colors.core.accent}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultListScroll}
              data={profiles}
              keyExtractor={keyExtractor}
              ListEmptyComponent={
                <EmptyList message="No results found. Try adjusting your search filters." />
              }
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              removeClippedSubviews
            />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default SearchResultScreen;
