import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileSetupStackParamList } from "@/navigation/profileSetupStack/types";

export type T_PREFERENCES_INFO = {
  navigation: NativeStackNavigationProp<
    ProfileSetupStackParamList,
    "CompleteProfileScreen",
    undefined
  >;
};
