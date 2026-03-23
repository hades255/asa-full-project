import React from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { BottomTabsParamList } from "./types";
import { View } from "react-native";
import { AppText, ButtonWrapper } from "@/components";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import { Heart, Home2, Notification, Task } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tabs = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = () => {
  const { theme } = useUnistyles();
  const CustomizeTabbar = ({
    state,
    descriptors,
    navigation,
  }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    return (
      <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const icon = options.tabBarIcon;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <ButtonWrapper
              key={route.key}
              onPress={onPress}
              otherProps={{
                style: [styles.tabItem, isFocused && styles.selectedTabItem],
              }}
            >
              {icon &&
                icon({
                  focused: isFocused,
                  color: isFocused
                    ? theme.colors.semantic.content.contentPrimary
                    : theme.colors.semantic.content.contentInverseTertionary,
                  size: 24,
                })}
              {/* @ts-ignore */}
              {isFocused && (
                <AppText
                  font="caption1"
                  color={theme.colors.semantic.content.contentPrimary}
                >
                  {/* @ts-ignore */}
                  {label}
                </AppText>
              )}
            </ButtonWrapper>
          );
        })}
      </View>
    );
  };

  return (
    <Tabs.Navigator
      initialRouteName="HomeStack"
      tabBar={(props) => <CustomizeTabbar {...props} />}
      screenOptions={{
        headerShown: false,
        popToTopOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="HomeStack"
        getComponent={() => require("../homeStack").default}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="BookingsStack"
        getComponent={() => require("../bookingsStack").default}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ color, size }) => <Task size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="FavouritesStack"
        getComponent={() => require("../favouritesStack").default}
        options={{
          tabBarLabel: "Wishlist",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="NotificationStack"
        getComponent={() => require("../notificationsStack").default}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Notification size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsStack"
        getComponent={() => require("../settingsStack").default}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTabs;
