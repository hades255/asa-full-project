import React, { useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { DrawerStackParamList } from "./types";
import BottomTabs from "../bottomTabs";
import { useUnistyles } from "react-native-unistyles";
import { View } from "react-native";
import { styles } from "./styles";
import { Logo } from "assets/images";
import {
  ArrowCircleRight,
  ClipboardText,
  CloseCircle,
  Headphone,
  Heart,
  Home,
  Notification,
  Setting4,
  Share,
  Shield,
  Star,
  Task,
} from "iconsax-react-native";
import { AppText, Avatar, ButtonWrapper } from "@/components";
import { useUser } from "@clerk/clerk-expo";
import { LeafIcon, StarIcon } from "assets/icons";
import { showSnackbar } from "@/utils/essentials";
import { useGetCurrentUserAPI } from "@/apis";

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { theme } = useUnistyles();
  const { user, isLoaded } = useUser();
  const [activeMenu, setActiveMenu] = useState(0);
  const { data: userData } = useGetCurrentUserAPI();

  const DrawerMenu = [
    {
      key: "0",
      title: "Home",
      onPress: () => {
        props.navigation.navigate("AppTabs", { screen: "HomeStack" });
      },
      icon: (color: string) => <Home size={24} color={color} />,
    },
    {
      key: "1",
      title: "Bookings",
      onPress: () => {
        props.navigation.navigate("AppTabs", { screen: "BookingsStack" });
      },
      icon: (color: string) => <Task size={24} color={color} />,
    },
    {
      key: "2",
      title: "Wishlist",
      onPress: () => {
        props.navigation.navigate("AppTabs", { screen: "FavouritesStack" });
      },
      icon: (color: string) => <Heart size={24} color={color} />,
    },
    {
      key: "3",
      title: "Notifications",
      onPress: () => {
        props.navigation.navigate("AppTabs", { screen: "NotificationStack" });
      },
      icon: (color: string) => <Notification size={24} color={color} />,
    },
    {
      key: "33",
      title: "Quick Preferences",
      onPress: () => {
        props.navigation.navigate("AppTabs", {
          screen: "SettingsStack",
          params: {
            screen: "UserPreferencesScreen",
          },
        });
      },
      icon: (color: string) => <Setting4 size={24} color={color} />,
    },
    {
      key: "44",
      isSeparator: true,
    },
    {
      key: "6",
      title: "Privacy Policy",
      onPress: () => {
        props.navigation.navigate("AppTabs", {
          screen: "SettingsStack",
          params: {
            screen: "PrivacyPolicyScreen",
          },
        });
      },
      icon: (color: string) => <Shield size={24} color={color} />,
    },
    {
      key: "7",
      title: "Terms & Conditions",
      onPress: () => {
        props.navigation.navigate("AppTabs", {
          screen: "SettingsStack",
          params: {
            screen: "TermsConditionsScreen",
          },
        });
      },
      icon: (color: string) => <ClipboardText size={24} color={color} />,
    },
    {
      key: "8",
      title: "Contact Support",
      onPress: () => {
        props.navigation.navigate("AppTabs", {
          screen: "SettingsStack",
          params: {
            screen: "ContactSupportScreen",
          },
        });
      },
      icon: (color: string) => <Headphone size={24} color={color} />,
    },
    {
      key: "9",
      title: "Rate & Reviews",
      icon: (color: string) => <Star size={24} color={color} />,
    },
    {
      key: "10",
      title: "Share with Friend",
      icon: (color: string) => <Share size={24} color={color} />,
    },
  ];

  if (!isLoaded || !user || !userData) {
    return;
  }

  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.mainContainer}
    >
      <View style={styles.headerContainer}>
        <Logo width={82} height={82} />
        <CloseCircle
          onPress={() => {
            props.navigation.closeDrawer();
          }}
          size={32}
          color={theme.colors.semantic.content.contentPrimary}
        />
      </View>
      <View style={styles.userDetailsContainer}>
        <View style={styles.userDetailsLeft}>
          <Avatar size={64} editable={false} />
          <View style={styles.userDetailsContent}>
            <AppText font="button1">{`${
              user?.firstName
                ? `${user?.firstName} ${user.lastName}`
                : `All Space User`
            }`}</AppText>
            <AppText
              font="caption2"
              color={theme.colors.semantic.content.contentInverseTertionary}
            >{`${user.primaryEmailAddress?.emailAddress}`}</AppText>
            <View style={styles.userDetailsContentRow}>
              <StarIcon
                width={16}
                height={16}
                color={theme.colors.semanticExtensions.content.contentAccent}
              />
              <AppText font="body2">{` ${userData.averageRating.toFixed(1)} (${
                userData.totalReviews
              })`}</AppText>
            </View>
          </View>
        </View>
        <ArrowCircleRight
          size={24}
          color={theme.colors.semantic.content.contentInverseTertionary}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.listContainer}>
        {DrawerMenu.map((item, index) => {
          let isActive = activeMenu === index;
          return item.isSeparator ? (
            <View key={item.key} style={styles.separator} />
          ) : (
            <ButtonWrapper
              onPress={() => {
                if (item.onPress) item.onPress();
                setActiveMenu(index);
                props.navigation.closeDrawer();
              }}
              key={item.key}
              otherProps={{
                style: [
                  styles.itemContainer,
                  {
                    backgroundColor: isActive
                      ? theme.colors.semanticExtensions.background
                          .backgroundAccent
                      : "transparent",
                  },
                ],
              }}
            >
              {item.icon &&
                item.icon(theme.colors.semantic.content.contentPrimary)}
              <AppText
                font="body1"
                color={theme.colors.semantic.content.contentPrimary}
              >
                {item.title}
              </AppText>
            </ButtonWrapper>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerStack = () => {
  const { theme } = useUnistyles();

  return (
    <Drawer.Navigator
      initialRouteName="AppTabs"
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: {
          width: 324,
        },
      }}
    >
      <Drawer.Screen name="AppTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
