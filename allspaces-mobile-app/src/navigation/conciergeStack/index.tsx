import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConciergeStackParamList } from "./types";
import { ScanDetails, Scanning } from "@/screens";

const Stack = createNativeStackNavigator<ConciergeStackParamList>();

const ConciergeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"ScanningScreen"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="ScanningScreen" component={Scanning} />
      <Stack.Screen name="ScanDetailsScreen" component={ScanDetails} />
    </Stack.Navigator>
  );
};

export default ConciergeStack;
