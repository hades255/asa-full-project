import { View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { T_SOCIAL_ACCOUNT_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppText, SocialCard } from "@/components";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
  InstaIcon,
  LinkedInIcon,
  TiktokIcon,
} from "assets/icons";
import { T_SOCIAL_LIST_ITEM } from "@/components/cards/socialCard/types";
import { useUser } from "@clerk/clerk-expo";
import useSocialAuth from "@/hooks/useSocialAuth";
import { useUnistyles } from "react-native-unistyles";
import { showSnackbar } from "@/utils/essentials";

const SocialAccountsInfo: React.FC<T_SOCIAL_ACCOUNT_INFO> = ({
  flatlistIndex,
  flatlistRef,
}) => {
  const { theme } = useUnistyles();
  const { isLoaded, user } = useUser();
  const { connectSocialAccount } = useSocialAuth();
  const socialIconSize = {
    width: 24,
    height: 24,
  };
  const SOCIAL_ACCOUNTS: T_SOCIAL_LIST_ITEM[] = [
    {
      key: "oauth_google",
      title: "Google",
      icon: <GoogleIcon {...socialIconSize} />,
    },
    {
      key: "oauth_facebook",
      title: "Facebook",
      icon: <FacebookIcon {...socialIconSize} />,
    },
    {
      key: "oauth_instagram",
      title: "Instagram",
      icon: <InstaIcon {...socialIconSize} />,
    },
    {
      key: "oauth_linkedin",
      title: "LinkedIn",
      icon: <LinkedInIcon {...socialIconSize} />,
    },
    {
      key: "oauth_tiktok",
      title: "Tiktok",
      icon: <TiktokIcon {...socialIconSize} />,
    },
  ];
  const [connectedAccounts, setConnectedAccounts] = useState<
    T_SOCIAL_LIST_ITEM[]
  >([]);

  useEffect(() => {
    if (user && isLoaded) {
      user.verifiedExternalAccounts.forEach((extAccount) => {
        if (extAccount.provider === "google")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[0]]);
        if (extAccount.provider === "facebook")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[1]]);
        if (extAccount.provider === "apple")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[2]]);
        if (extAccount.provider === "linkedin")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[3]]);
        if (extAccount.provider === "tiktok")
          setConnectedAccounts((prev) => [...prev, SOCIAL_ACCOUNTS[4]]);
      });
    }
  }, [user, isLoaded]);

  const onSocialCardPress = async (socialItem: T_SOCIAL_LIST_ITEM) => {
    try {
      if (!isLoaded || !user) return;

      if (socialItem.title != "Google") return;

      let alreadyConnected = user.verifiedExternalAccounts.find(
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
  };

  return (
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
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ rowGap: theme.units[3] }}
          renderItem={({ item }) => (
            <SocialCard
              socialItem={item}
              connectedAccounts={connectedAccounts}
              onSocialCardPress={onSocialCardPress}
            />
          )}
        />
      </View>
      <AppButton
        title="Continue"
        disabled={connectedAccounts.length < 1}
        onPress={async () => {
          flatlistRef.current?.scrollToIndex({
            index: flatlistIndex.value + 1,
            animated: true,
          });
        }}
      />
    </View>
  );
};

export default SocialAccountsInfo;
