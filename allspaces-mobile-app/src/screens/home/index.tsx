import { View, FlatList, Platform, TouchableOpacity } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Location from "expo-location";
import { T_HOME_SCREEN } from "./types";
import {
  ScreenWrapper,
  HeaderHome,
  AppText,
  ButtonWrapper,
  AppCategories,
  HomeListSection,
  BiometricModal,
  SearchInputBar,
} from "@/components";
import { styles } from "./styles";
import { useDispatch, useSelector } from "@/redux/hooks";
import {
  actionSetCompleteProfile,
  actionSetShowBiometricModal,
  actionSetIntentSearchResult,
} from "@/redux/app.slice";
import { selectGooglePlaceData } from "@/redux/selectors";
import { searchByPrompt } from "@/apis/intentApi";
import { showSnackbar } from "@/utils/essentials";
import { envConfig } from "@/utils/envConfig";

import { useUser } from "@clerk/clerk-expo";
import { useUnistyles } from "react-native-unistyles";
import { Slider } from "iconsax-react-native";
import { useProfileProvider } from "@/hooks/useProfileProvider";
import { useFocusEffect } from "@react-navigation/native";
import { SecureStoreService } from "@/config/secureStore";

const Home: React.FC<T_HOME_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { user } = useUser();
  const googlePlaceData = useSelector(selectGooglePlaceData);
  const { isProfileCompleted, checkProfileCompletion } = useProfileProvider();
  const hasCheckedBiometricPromptRef = useRef(false);
  const [lastLocation, setLastLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [timezone, setTimezone] = useState("Europe/London");
  const [searchError, setSearchError] = useState<string | null>(null);

  const hasIntentApi = Boolean(envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch {
      // ignore
    }

    const FALLBACK_LOCATION = {
      lat: 51.5074,
      lng: -0.1278,
      address: "14 Grange Road, London, N6 4DG, United Kingdom",
    };

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (__DEV__) setLastLocation(FALLBACK_LOCATION);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        const { latitude, longitude } = loc.coords;
        let address = "Current location";
        try {
          const [rev] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          address =
            rev?.street && rev?.city
              ? `${rev.street}, ${rev.city}${
                  rev.country ? `, ${rev.country}` : ""
                }`
              : rev?.city || rev?.region || address;
        } catch {
          // ignore
        }
        setLastLocation({ lat: latitude, lng: longitude, address });
      } catch {
        if (__DEV__) setLastLocation(FALLBACK_LOCATION);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkBiometricPrompt = async () => {
        if (hasCheckedBiometricPromptRef.current) return;
        hasCheckedBiometricPromptRef.current = true;
        const biometricAsked = await SecureStoreService.getValue(
          "BIOMETRIC_ASKED"
        );
        if (isActive && biometricAsked == null) {
          dispatch(actionSetShowBiometricModal(true));
        }
      };

      checkBiometricPrompt();

      return () => {
        isActive = false;
      };
    }, [dispatch])
  );

  const sections = useMemo(
    () => ["Trending", "Most Relevant", "Nearby You"],
    []
  );

  const handleCompleteProfile = useCallback(() => {
    dispatch(actionSetCompleteProfile(true));
  }, [dispatch]);

  const handleGoToSearch = useCallback(() => {
    navigation.navigate("SearchScreen");
  }, [navigation]);

  const handlePromptSubmit = useCallback(
    async (text: string) => {
      const trimmed = text?.trim();
      if (!trimmed) return;

      if (!hasIntentApi) {
        showSnackbar(
          "Search server not configured. Set EXPO_PUBLIC_INTENT_API_BASE_URL.",
          "warning"
        );
        return;
      }

      setSearchError(null);
      try {
        const context = {
          timezone,
          lastLocation:
            lastLocation ||
            (googlePlaceData?.geometry?.location
              ? {
                  lat: googlePlaceData.geometry.location.lat,
                  lng: googlePlaceData.geometry.location.lng,
                  address: googlePlaceData.formatted_address,
                }
              : undefined),
        };

        const result = await searchByPrompt({ prompt: trimmed, context });
        if (result?.error) {
          const fullError = JSON.stringify(
            {
              type: "API_ERROR",
              error: result.error,
              summary: result.summary,
              noMatchMessage: result.noMatchMessage,
              raw: result,
            },
            null,
            2
          );
          setSearchError(fullError);
          showSnackbar(result.error, "error");
          return;
        }
        dispatch(actionSetIntentSearchResult({ ...result, prompt: trimmed }));
        navigation.navigate("SearchResultScreen");
      } catch (err: any) {
        const fullError = JSON.stringify(
          {
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
            statusText: err?.response?.statusText,
            data: err?.response?.data,
            config: err?.config
              ? {
                  url: err.config?.url,
                  method: err.config?.method,
                }
              : undefined,
          },
          null,
          2
        );
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.details ||
          err?.message ||
          "Search failed";
        setSearchError(fullError);
        showSnackbar(msg, "error");
      }
    },
    [
      hasIntentApi,
      timezone,
      lastLocation,
      googlePlaceData,
      dispatch,
      navigation,
    ]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.listHeader}>
        {!isProfileCompleted && (
          <ButtonWrapper
            onPress={handleCompleteProfile}
            otherProps={{
              style: styles.noteContainer,
            }}
          >
            <AppText
              font="body2"
              color={theme.colors.semantic.content.contentPrimary}
            >
              {`Note: You have to complete your profile to gain access to all features. `}
              <AppText
                font="body2"
                color={theme.colors.semantic.content.contentPrimary}
                style={{ textDecorationLine: "underline" }}
              >{`Complete Profile`}</AppText>
            </AppText>
          </ButtonWrapper>
        )}
        <View style={styles.welcomeContainer}>
          <AppText font="heading3">{`Hey ${
            user?.firstName || ""
          }, let's find you a perfect local space or service`}</AppText>
          <SearchInputBar
            onSubmit={handlePromptSubmit}
            placeholder="Tell me what you need…"
            disabled={!hasIntentApi}
            containerStyle={{ alignSelf: "stretch" }}
            showVoiceStatus={false}
          />
          {searchError && (
            <TouchableOpacity
              onPress={() => setSearchError(null)}
              activeOpacity={0.9}
              style={[
                styles.errorBar,
                {
                  backgroundColor:
                    theme.colors.semanticExtensions.background
                      .backgroundNegative || "#fee2e2",
                  borderLeftColor:
                    theme.colors.semanticExtensions.content.contentNegative ||
                    "#dc2626",
                },
              ]}
            >
              <AppText
                font="caption1"
                color={theme.colors.semanticExtensions.content.contentNegative}
                style={styles.errorBarTitle}
              >
                Search error
              </AppText>
              <AppText
                font="caption1"
                color={theme.colors.semantic.content.contentPrimary}
                style={styles.errorBarDetail}
                textProps={{ numberOfLines: 12 }}
              >
                {searchError}
              </AppText>
            </TouchableOpacity>
          )}
          <View style={styles.filterLink}>
            <AppText
              font="button2"
              color={theme.colors.semanticExtensions.content.contentAccent}
              style={{ textDecorationLine: "underline" }}
              textProps={{
                onPress: handleGoToSearch,
              }}
            >
              {`Filters`}
            </AppText>
          </View>
        </View>
        <AppCategories />
      </View>
    );
  }, [
    handleCompleteProfile,
    handleGoToSearch,
    handlePromptSubmit,
    isProfileCompleted,
    searchError,
    theme.colors.semantic.content.contentPrimary,
    theme.colors.semanticExtensions.background.backgroundNegative,
    theme.colors.semanticExtensions.content.contentNegative,
    user?.firstName,
  ]);

  const renderSection = useCallback(({ item }: { item: string }) => {
    return <HomeListSection title={item} />;
  }, []);

  return (
    <ScreenWrapper withoutBottomPadding>
      <BiometricModal />
      <HeaderHome />
      <View style={styles.mainContainer}>
        <FlatList
          data={sections}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.mainScrollContainer}
          ListHeaderComponent={renderHeader}
          renderItem={renderSection}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;
