import { View, FlatList } from "react-native";
import React, { useEffect, useRef } from "react";
import { T_HOME_SCREEN } from "./types";
import {
  ScreenWrapper,
  HeaderHome,
  AppText,
  ButtonWrapper,
  AppCategories,
  HomeListSection,
  BiometricModal,
} from "@/components";
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import {
  actionSetCompleteProfile,
  actionSetShowBiometricModal,
} from "@/redux/app.slice";
import { useUser } from "@clerk/clerk-expo";
import { useUnistyles } from "react-native-unistyles";
import { SearchNormal1 } from "iconsax-react-native";
import useBiometric from "@/hooks/useBiometric";
import { useProfileProvider } from "@/hooks/useProfileProvider";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import { SecureStoreService } from "@/config/secureStore";

const Home: React.FC<T_HOME_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { user } = useUser();
  const { isProfileCompleted, checkProfileCompletion } = useProfileProvider();
  const { isBiometricEnabled, biometricAsked, refreshBiometricState } = useBiometric();
  const { hasCredentials } = useLocalCredentials();
  
  // Use ref to prevent multiple modal triggers in the same session
  const modalShownRef = useRef(false);

  useEffect(() => {
    const showBiometricModalOnce = async () => {
      // Only show biometric modal if:
      // 1. User has credentials (logged in with email/password)
      // 2. Biometric is not enabled
      // 3. Hasn't been asked yet
      // 4. Haven't shown modal in this session
      if (hasCredentials && !isBiometricEnabled && !biometricAsked && !modalShownRef.current) {
        modalShownRef.current = true;
        
        setTimeout(() => {
          dispatch(actionSetShowBiometricModal(true));
        }, 1000);
      }
    };

    showBiometricModalOnce();
  }, [hasCredentials, isBiometricEnabled, biometricAsked, dispatch]);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  return (
    <ScreenWrapper withoutBottomPadding>
      <HeaderHome />
      <BiometricModal />
      <View style={styles.mainContainer}>
        <FlatList
          data={["Trending", "Most Relevant", "Nearby You"]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.mainScrollContainer}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              {!isProfileCompleted && (
                <ButtonWrapper
                  onPress={() => {
                    dispatch(actionSetCompleteProfile(true));
                  }}
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
                <ButtonWrapper
                  onPress={() => {
                    navigation.navigate("SearchScreen");
                  }}
                  otherProps={{
                    style: styles.searchButton,
                  }}
                >
                  <SearchNormal1
                    size={24}
                    color={theme.colors.semantic.content.contentPrimary}
                  />
                  <AppText
                    font="body1"
                    color={
                      theme.colors.semantic.content.contentInverseTertionary
                    }
                  >{`Search`}</AppText>
                </ButtonWrapper>
              </View>
              <AppCategories />
            </View>
          )}
          renderItem={({ item }) => <HomeListSection title={item} />}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;
