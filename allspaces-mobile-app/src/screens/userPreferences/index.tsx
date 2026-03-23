import { View, ActivityIndicator, FlatList } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { T_USER_PREFERENCES } from "./types";
import {
  AppButton,
  AppLoader,
  AppText,
  Header2,
  PrefCard,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import {
  useGetMyPreferencesAPI,
  useGetPreferencesAPI,
  useUpdatePreferencesAPI,
} from "@/apis";
import { useUnistyles } from "react-native-unistyles";
import { useUser } from "@clerk/clerk-expo";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { T_SUB_PREFERENCE_ITEM } from "@/apis/types";

const UserPreferences: React.FC<T_USER_PREFERENCES> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const { user, isLoaded } = useUser();

  const { data: prefData, isLoading } = useGetPreferencesAPI();
  const preferences = prefData?.data;

  const { data: myPreferences, isPending: myPrefLoading } =
    useGetMyPreferencesAPI();
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const { mutateAsync: updatePreferencesAPI, isPending: updateLoading } =
    useUpdatePreferencesAPI();

  const onPrefCardPress = useCallback((subPrefItem: T_SUB_PREFERENCE_ITEM) => {
    setSelectedPrefs((prev) => {
      const found = prev.includes(subPrefItem.id);
      return found ? prev.filter((id) => id !== subPrefItem.id) : [...prev, subPrefItem.id];
    });
  }, []);

  useEffect(() => {
    if (myPreferences) setSelectedPrefs(myPreferences);
  }, [myPreferences]);

  const onUpdatePrefs = useCallback(async () => {
    try {
      if (!user || !isLoaded) {
        return;
      }

      await updatePreferencesAPI(selectedPrefs);

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasPreferences: true,
        },
      });
      await user.reload();
      showSnackbar("Your preferences are saved!");
      navigation.goBack();
    } catch (error) {
      showClerkError(error);
    }
  }, [isLoaded, navigation, selectedPrefs, updatePreferencesAPI, user]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderSeparator = useCallback(() => {
    return (
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: theme.colors.core.accent,
          opacity: 0.3,
          marginTop: theme.units[6],
        }}
      />
    );
  }, [theme.colors.core.accent, theme.units]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <PrefCard
        prefItem={item}
        selectedPrefItems={selectedPrefs}
        onPrefCardPress={onPrefCardPress}
      />
    ),
    [onPrefCardPress, selectedPrefs]
  );

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Quick Preferences" />
      <View style={styles.mainContainer}>
        <View
          style={{
            marginHorizontal: theme.units[5],
            marginTop: theme.units[6],
          }}
        >
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Tell us about your perfect space`}</AppText>
        </View>
        {isLoading || myPrefLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size={"small"}
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
          </View>
        ) : (
          <View style={styles.body}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={preferences}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                rowGap: theme.units[4],
                paddingBottom: theme.units[6],
              }}
              ItemSeparatorComponent={renderSeparator}
              renderItem={renderItem}
            />
            <AppButton
              title="Continue"
              disabled={selectedPrefs.length < 1 || updateLoading}
              onPress={onUpdatePrefs}
            />
          </View>
        )}
      </View>
      <AppLoader visible={updateLoading} />
    </ScreenWrapper>
  );
};

export default UserPreferences;
