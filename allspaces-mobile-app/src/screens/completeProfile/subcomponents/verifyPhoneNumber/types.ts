import * as yup from "yup";
import { AnimatedRef, SharedValue } from "react-native-reanimated";
import { FlatList } from "react-native";
import { T_COMPLETE_PROFILE_ITEM } from "../../types";
import { PhoneNumberResource } from "@clerk/types";

export type T_VERIFY_PHONE_NUMBER = {
  flatlistRef: AnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>;
  flatlistIndex: SharedValue<number>;
  phoneObj: PhoneNumberResource | undefined;
};

export type T_VERIFY_PHONE_NUMBER_FIELDS = {
  code: string;
};

export const S_VERIFY_PHONE_NUMBER_FIELDS = yup
  .object({
    code: yup.string().required().length(6),
  })
  .required();
