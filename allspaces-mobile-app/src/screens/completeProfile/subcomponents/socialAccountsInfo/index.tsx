import { View, FlatList, Keyboard } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { T_SOCIAL_ACCOUNT_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppText, SocialCard } from "@/components";
import { GoogleIcon } from "assets/icons";
import { T_SOCIAL_LIST_ITEM } from "@/components/cards/socialCard/types";
import { useUser } from "@clerk/clerk-expo";
import useSocialAuth from "@/hooks/useSocialAuth";
import { useUnistyles } from "react-native-unistyles";
import { showSnackbar } from "@/utils/essentials";
import StepLayout from "../stepLayout";

const socialIconSize = { width: 24, height: 24 };

const SOCIAL_ACCOUNTS: T_SOCIAL_LIST_ITEM[] = [
  {
    key: "oauth_google",
    title: "Google",
    icon: <GoogleIcon {...socialIconSize} />,
  },
];

const SocialAccountsInfo: React.FC<T_SOCIAL_ACCOUNT_INFO> = ({ onNext }) => {
  const { theme } = useUnistyles();
  const { isLoaded, user } = useUser();
  const { connectSocialAccount } = useSocialAuth();
  const [connectedAccounts, setConnectedAccounts] = useState<T_SOCIAL_LIST_ITEM[]>([]);

  useEffect(() => {
    if (user && isLoaded) {
      user.verifiedExternalAccounts.forEach((extAccount) => {
        if (extAccount.provider === "google")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[0]]);
      });
    }
  }, [user, isLoaded]);

  const onSocialCardPress = useCallback(async (socialItem: T_SOCIAL_LIST_ITEM) => {
    try {
      if (!isLoaded || !user) return;
      if (socialItem.title !== "Google") return;

      const alreadyConnected = user.verifiedExternalAccounts.find(
        (item) => item.verification?.strategy === socialItem.key
      );
      if (alreadyConnected) {
        showSnackbar(`Account is already connected`, "warning");
        return;
      }

      await connectSocialAccount({ type: socialItem.key });
      await user.reload();
    } catch (error) {
      showSnackbar(`${error}`, "error");
    }
  }, [connectSocialAccount, isLoaded, user]);

  const handleContinue = useCallback(() => {
    Keyboard.dismiss();
    onNext();
  }, [onNext]);

  const keyExtractor = useCallback((item: T_SOCIAL_LIST_ITEM) => item.key, []);

  const renderItem = useCallback(
    ({ item }: { item: T_SOCIAL_LIST_ITEM }) => (
      <SocialCard
        socialItem={item}
        connectedAccounts={connectedAccounts}
        onSocialCardPress={onSocialCardPress}
      />
    ),
    [connectedAccounts, onSocialCardPress]
  );

  return (
    <StepLayout>
      <View style={styles.mainContainer}>
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Social Accounts`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Connect at least one social account`}</AppText>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={SOCIAL_ACCOUNTS}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ rowGap: theme.units[3] }}
            renderItem={renderItem}
          />
        </View>
        <AppButton
          title="Continue"
          disabled={connectedAccounts.length < 1}
          onPress={handleContinue}
        />
      </View>
    </StepLayout>
  );
};

export default SocialAccountsInfo;
