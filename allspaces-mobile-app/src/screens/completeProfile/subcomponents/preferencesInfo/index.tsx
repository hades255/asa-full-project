import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useCallback, useMemo, useState } from "react";
import { T_PREFERENCES_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppLoader, AppText, PrefCard } from "@/components";
import { useUser } from "@clerk/clerk-expo";
import { gotoAllSetFromCompleteProfile } from "@/navigation/service";
import { useDispatch } from "@/redux/hooks";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import {
  useGetPreferencesAPI,
  useUpdatePreferencesAPI,
} from "@/apis";
import { useProfileProvider } from "@/hooks/useProfileProvider";
import { T_SUB_PREFERENCE_ITEM } from "@/apis/types";
import StepLayout from "../stepLayout";

const PreferencesInfo: React.FC<T_PREFERENCES_INFO> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const { checkProfileCompletion } = useProfileProvider();
  const { data: prefData, isLoading } = useGetPreferencesAPI();
  const preferences = prefData?.data;
  const { mutateAsync: updatePreferencesAPI } = useUpdatePreferencesAPI();
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const onPrefCardPress = useCallback((subPrefItem: T_SUB_PREFERENCE_ITEM) => {
    setSelectedPrefs((prev) => {
      const found = prev.includes(subPrefItem.id);
      return found ? prev.filter((id) => id !== subPrefItem.id) : [...prev, subPrefItem.id];
    });
  }, []);

  const completeProfile = useCallback(async () => {
    try {
      if (!user || !isLoaded) return;

      await updatePreferencesAPI(selectedPrefs);
      dispatch(actionSetAppLoading(true));

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasPreferences: true,
        },
      });
      await user.reload();
      checkProfileCompletion();

      dispatch(actionSetAppLoading(false));
      gotoAllSetFromCompleteProfile(navigation);
      showSnackbar("Your preferences are saved!");
    } catch (error) {
      showClerkError(error);
    }
  }, [
    checkProfileCompletion,
    dispatch,
    isLoaded,
    navigation,
    selectedPrefs,
    updatePreferencesAPI,
    user,
  ]);

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
    <StepLayout>
      <View style={styles.mainContainer} pointerEvents="box-none">
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Quick Preferences`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Tell us about your perfect space`}</AppText>
        </View>
        {!isLoading && preferences && (
          <View style={styles.middleContainer} pointerEvents="box-none" collapsable={false}>
            <FlatList
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              data={preferences}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                rowGap: theme.units[4],
                paddingBottom: theme.units[4],
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              ItemSeparatorComponent={renderSeparator}
              renderItem={renderItem}
            />
          </View>
        )}
        <AppButton
          title="Update"
          disabled={selectedPrefs.length < 1}
          onPress={completeProfile}
        />
        <AppLoader visible={isLoading} />
      </View>
    </StepLayout>
  );
};

export default PreferencesInfo;
