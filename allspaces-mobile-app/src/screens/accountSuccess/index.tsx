import { View } from "react-native";
import React from "react";
import { T_ACCOUNT_SUCCESS_SCREEN } from "./types";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { Logo } from "assets/images";
import { useDispatch, useSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useUser, useClerk } from "@clerk/clerk-expo";
import {
  actionSetAppLoading,
  actionSetCompleteProfile,
  actionSetCreatedSessionId,
} from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";
import { showClerkError, showSnackbar } from "@/utils/essentials";

const AccountSuccess: React.FC<T_ACCOUNT_SUCCESS_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { setActive } = useClerk();
  const { isLoaded } = useUser();
  const { createdSessionId, isConcierge } = useSelector(
    (state: RootState) => state.appSlice
  );

  const completeSignup = async () => {
    if (!isLoaded || !setActive || !createdSessionId) {
      showSnackbar("Session activation is not ready. Please try again.", "error");
      return false;
    }

    try {
      dispatch(actionSetAppLoading(true));
      await setActive({ session: createdSessionId });
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(actionSetCreatedSessionId(null));
      dispatch(actionSetAppLoading(false));
      return true;
    } catch (error: any) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
      return false;
    }
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
          >
            {!isConcierge
              ? `Your All Spaces account is created. Now you can complete the profile or skip to Home`
              : `Your All Spaces Concierge account is created. Now you can scan booking's Qr code and can see the details`}
          </AppText>
        </View>
        <View style={styles.buttonsContainer}>
          {isConcierge ? (
            <AppButton
              title="Continue"
              onPress={async () => {
                const success = await completeSignup();
                if (success) {
                  dispatch(actionSetCompleteProfile(true));
                }
              }}
            />
          ) : (
            <>
              <AppButton
                title="Complete Profile"
                onPress={async () => {
                  const success = await completeSignup();
                  if (success) {
                    dispatch(actionSetCompleteProfile(true));
                  }
                }}
              />
              <AppButton
                title="Skip to Home"
                variant="text-btn"
                onPress={async () => {
                  const success = await completeSignup();
                  if (success) {
                    dispatch(actionSetCompleteProfile(false));
                  }
                }}
              />
            </>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AccountSuccess;
