import { ERRORS } from "@/config/constants";
import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { AnimatedRef, SharedValue } from "react-native-reanimated";
import { FlatList } from "react-native";
import { T_COMPLETE_PROFILE_ITEM } from "../../types";

export type T_PERSONAL_INFO = {
  flatlistRef: AnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>;
  flatlistIndex: SharedValue<number>;
};

export type T_LOGIN_FIELDS = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type T_PERSONAL_INFO_FIELDS = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export const S_PERSONAL_INFO_FIELDS = yup
  .object({
    firstName: yup.string().required(ERRORS.firstName),
    lastName: yup.string().required(ERRORS.lastName),
    dateOfBirth: yup.string().required(ERRORS.dateOfBirth),
  })
  .required();
