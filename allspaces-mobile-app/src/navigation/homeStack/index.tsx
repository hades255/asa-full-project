import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./types";
import {
  Home,
  SearchScreen,
  SearchResultScreen,
  BookingDetailsScreen,
  SearchFilters,
  AccorDetailsScreen,
} from "@/screens";
import BookingOrderDetails from "@/screens/bookingOrderDetails";
import PaymentScreen from "@/screens/paymentScreen";
import BookingOrderOwnDetails from "@/screens/bookingOrderOwnDetails";
import PaymentSuccessfully from "@/screens/paymentSuccessfully";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"HomeScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
      <Stack.Screen
        name="BookingDetailScreen"
        component={BookingDetailsScreen}
      />
      <Stack.Screen name="AccorDetailScreen" component={AccorDetailsScreen} />
      <Stack.Screen
        name="BookingOrderDetailScreen"
        component={BookingOrderDetails}
      />
      <Stack.Screen
        name="BookingOrderOwnDetailScreen"
        component={BookingOrderOwnDetails}
      />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen
        name="PaymentSuccessfullyScreen"
        component={PaymentSuccessfully}
      />
      <Stack.Screen
        name="SearchFiltersScreen"
        component={SearchFilters}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
