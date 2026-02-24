import { FlatList } from "react-native";
import { AnimatedRef, SharedValue } from "react-native-reanimated";
import { T_COMPLETE_PROFILE_ITEM } from "../../types";

export type T_SOCIAL_ACCOUNT_INFO = {
  flatlistRef: AnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>;
  flatlistIndex: SharedValue<number>;
};
