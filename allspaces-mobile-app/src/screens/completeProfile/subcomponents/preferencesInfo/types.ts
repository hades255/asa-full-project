import { FlatList } from "react-native";
import { AnimatedRef, SharedValue } from "react-native-reanimated";
import { T_COMPLETE_PROFILE_ITEM } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileSetupStackParamList } from "@/navigation/profileSetupStack/types";

export type T_PREFERENCES_INFO = {
  flatlistRef: AnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>;
  flatlistIndex: SharedValue<number>;
  navigation: NativeStackNavigationProp<
    ProfileSetupStackParamList,
    "CompleteProfileScreen",
    undefined
  >;
};
