import { View, FlatList } from "react-native";
import React, { useState } from "react";
import { T_PREFERENCES_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppLoader, AppText, PrefCard } from "@/components";
import { useSession, useUser } from "@clerk/clerk-expo";
import { gotoAllSetFromCompleteProfile } from "@/navigation/service";
import { useDispatch } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import {
  useCreatePreferencesAPI,
  useGetPreferencesAPI,
  useUpdatePreferencesAPI,
} from "@/apis";
import { useProfileProvider } from "@/hooks/useProfileProvider";
import { T_SUB_PREFERENCE_ITEM } from "@/apis/types";

const PreferencesInfo: React.FC<T_PREFERENCES_INFO> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const dispatch = useDispatch();

  const { checkProfileCompletion } = useProfileProvider();
  const { data: prefData, isLoading } = useGetPreferencesAPI();
  const preferences = prefData?.data;
  const { mutateAsync: updatePreferencesAPI } = useUpdatePreferencesAPI();

  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const onPrefCardPress = (subPrefItem: T_SUB_PREFERENCE_ITEM) => {
    const itemFound = selectedPrefs.find((item) => item === subPrefItem.id);
    if (itemFound) {
      setSelectedPrefs((prev) => prev.filter((item) => item != subPrefItem.id));
    } else {
      setSelectedPrefs((prev) => [...prev, subPrefItem.id]);
    }
  };

  const completeProfile = async () => {
    try {
      if (!user || !isLoaded) {
        return;
      }

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
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ rowGap: theme.units[1] }}>
        <AppText font="heading2">{`Quick Preferences`}</AppText>
        <AppText
          font="body1"
          color={theme.colors.semantic.content.contentInverseTertionary}
        >{`Tell us about your perfect space`}</AppText>
      </View>
      {!isLoading && preferences && (
        <View style={styles.middleContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={preferences}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ rowGap: theme.units[4] }}
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
        </View>
      )}
      <AppButton
        title="Update"
        disabled={selectedPrefs.length < 1}
        onPress={completeProfile}
      />
      <AppLoader visible={isLoading} />
    </View>
  );
};

export default PreferencesInfo;
