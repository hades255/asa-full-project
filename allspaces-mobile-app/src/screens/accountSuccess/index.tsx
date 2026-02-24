import { View } from "react-native";
import React from "react";
import { T_ACCOUNT_SUCCESS_SCREEN } from "./types";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { Logo } from "assets/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSignUp } from "@clerk/clerk-expo";
import {
  actionSetCompleteProfile,
  actionSetCreatedSessionId,
} from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";

const AccountSuccess: React.FC<T_ACCOUNT_SUCCESS_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { setActive, isLoaded } = useSignUp();
  const { createdSessionId } = useSelector(
    (state: RootState) => state.appSlice
  );

  const completeSignup = async () => {
    if (!isLoaded) return;
    await setActive({ session: createdSessionId });
    dispatch(actionSetCreatedSessionId(null));
  };

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <Logo width={128} height={128} />
        <View style={styles.contentContainer}>
          <AppText
            font="heading2"
            textAlign="center"
          >{`Account Created`}</AppText>
          <AppText
            font="body1"
            textAlign="center"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Your All Spaces account is created. Now you can complete the profile or skip to Home`}</AppText>
        </View>
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Complete Profile"
            onPress={() => {
              dispatch(actionSetCompleteProfile(true));
              completeSignup();
            }}
          />
          <AppButton
            title="Skip to Home"
            variant="text-btn"
            onPress={() => {
              completeSignup();
              dispatch(actionSetCompleteProfile(false));
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AccountSuccess;
