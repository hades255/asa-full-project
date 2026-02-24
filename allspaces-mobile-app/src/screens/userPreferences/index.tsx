import { View, ActivityIndicator, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
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

  const onPrefCardPress = (subPrefItem: T_SUB_PREFERENCE_ITEM) => {
    const itemFound = selectedPrefs.find((item) => item === subPrefItem.id);
    if (itemFound) {
      setSelectedPrefs((prev) => prev.filter((item) => item != subPrefItem.id));
    } else {
      setSelectedPrefs((prev) => [...prev, subPrefItem.id]);
    }
  };

  useEffect(() => {
    if (myPreferences) setSelectedPrefs(myPreferences);
  }, [myPreferences]);

  const onUpdatePrefs = async () => {
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
  };

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
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                rowGap: theme.units[4],
                paddingBottom: theme.units[6],
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: theme.colors.core.accent,
                    opacity: 0.3,
                    marginTop: theme.units[6],
                  }}
                />
              )}
              renderItem={({ item }) => (
                <PrefCard
                  prefItem={item}
                  selectedPrefItems={selectedPrefs}
                  onPrefCardPress={onPrefCardPress}
                />
              )}
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
