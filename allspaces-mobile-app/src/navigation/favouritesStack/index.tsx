import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FavouritesStackParamList } from "./types";
import { Favourites } from "@/screens";

const Stack = createNativeStackNavigator<FavouritesStackParamList>();

const FavouritesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"FavouritesScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="FavouritesScreen" component={Favourites} />
    </Stack.Navigator>
  );
};

export default FavouritesStack;
