import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationsStackParamList } from "./types";
import { Notifications } from "@/screens";

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

const NotificationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"NotificationsScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="NotificationsScreen" component={Notifications} />
    </Stack.Navigator>
  );
};

export default NotificationStack;
