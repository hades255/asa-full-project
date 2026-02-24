import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { T_SETTINGS_SCREEN } from "./types";
import {
  AppButton,
  AppText,
  Avatar,
  ButtonWrapper,
  Header1,
  IconButton,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import {
  ArrowSquareRight,
  ClipboardText,
  EmptyWallet,
  Headphone,
  Lock,
  Login,
  LoginCurve,
  MessageQuestion,
  Notification,
  Setting4,
  Share,
  Shield,
  Star,
} from "iconsax-react-native";
import { gotoSubMenuFromSettings } from "@/navigation/service";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { getVersion } from "react-native-device-info";
import { useUnistyles } from "react-native-unistyles";
import { LeafIcon, StarIcon } from "assets/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Settings: React.FC<T_SETTINGS_SCREEN> = ({ navigation }) => {
  const { isLoaded, signOut } = useAuth();
  const { currentUser } = useSelector((state: RootState) => state.appSlice);
  const { theme } = useUnistyles();
  const { user } = useUser();
  const [version, setVersion] = useState<string>("");

  const MENUS = [
    {
      key: "1",
      title: "Account",
      subMenus: [
        {
          key: "10",
          title: "Login Methods",
          onPress: async () => {
            gotoSubMenuFromSettings(navigation, "LoginMethodsScreen");
          },
          icon: (
            <Login
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "11",
          title: "Quick Preferences",
          onPress: async () => {
            gotoSubMenuFromSettings(navigation, "UserPreferencesScreen");
          },
          icon: (
            <Setting4
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "12",
          title: "Change Password",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "ChangePasswordScreen");
          },
          icon: (
            <Lock
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        // {
        //   key: "14",
        //   title: "Leaderboard",
        //   onPress: () => {
        //     gotoSubMenuFromSettings(navigation, "LeaderBoardScreen");
        //   },
        //   icon: (
        //     <Cup
        //       size={24}
        //       color={theme.colors.semantic.content.contentPrimary}
        //     />
        //   ),
        // },
        {
          key: "13",
          title: "Notifications",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "NotifSettingsScreen");
          },
          icon: (
            <Notification
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "14",
          title: "Payment Method",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "PaymentMethodScreen");
          },
          icon: (
            <EmptyWallet
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
      ],
    },
    {
      key: "2",
      title: "More",
      subMenus: [
        {
          key: "21",
          title: "Privacy Policy",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "PrivacyPolicyScreen");
          },
          icon: (
            <Shield
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "22",
          title: "Terms & Conditions",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "TermsConditionsScreen");
          },
          icon: (
            <ClipboardText
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "23",
          title: "FAQs",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "FaqsScreen");
          },
          icon: (
            <MessageQuestion
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "24",
          title: "Contact Support",
          onPress: () => {
            gotoSubMenuFromSettings(navigation, "ContactSupportScreen");
          },
          icon: (
            <Headphone
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "25",
          title: "Rate & Reviews",
          icon: (
            <Star
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
        {
          key: "26",
          title: "Share with Friend",
          icon: (
            <Share
              size={24}
              color={theme.colors.semantic.content.contentPrimary}
            />
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    setVersion(getVersion());
  }, []);

  const onSignoutClick = async () => {
    if (!isLoaded) return;
    await signOut();
  };

  return user ? (
    <ScreenWrapper withoutBottomPadding>
      <Header1
        title="Settings"
        renderRight={
          <IconButton
            icon={
              <LoginCurve
                size={24}
                color={theme.colors.semanticExtensions.content.contentNegative}
              />
            }
            onPress={onSignoutClick}
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.topContainer}>
          <View style={styles.userDetailsContainer}>
            <View style={styles.userDetailsLeft}>
              <Avatar size={64} editable={false} />
              <View style={styles.userDetailsContent}>
                <AppText font="button1">{`${
                  user && user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.emailAddresses[0].emailAddress
                }`}</AppText>
                <View style={styles.userDetailsContentRow}>
                  <StarIcon
                    width={16}
                    height={16}
                    color={
                      theme.colors.semanticExtensions.content.contentAccent
                    }
                  />
                  <AppText font="body2">{` ${currentUser?.averageRating.toFixed(
                    1
                  )} (${currentUser?.totalReviews})`}</AppText>
                </View>
              </View>
            </View>
          </View>
          <AppButton
            onPress={() => {
              gotoSubMenuFromSettings(navigation, "EditProfileScreen");
            }}
            title="Edit Profile"
          />
        </View>

        {MENUS.map((item) => (
          <View key={item.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.subMenus.map((subMenuItem) => (
              <ButtonWrapper
                onPress={subMenuItem.onPress}
                key={subMenuItem.key}
                otherProps={{
                  style: styles.sectionRow,
                }}
              >
                <View style={styles.sectionRowLeft}>
                  {subMenuItem.icon}
                  <Text style={styles.sectionRowTitle}>
                    {subMenuItem.title}
                  </Text>
                </View>
                <ArrowSquareRight
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              </ButtonWrapper>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.versionContainer}>
        <Text style={styles.appVersion}>{`App version ${version}`}</Text>
      </View>
    </ScreenWrapper>
  ) : null;
};

export default Settings;
