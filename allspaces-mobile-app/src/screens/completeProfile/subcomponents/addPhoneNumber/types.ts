import { ERRORS } from "@/config/constants";
import * as yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
import { AnimatedRef, SharedValue } from "react-native-reanimated";
import { FlatList } from "react-native";
import { T_COMPLETE_PROFILE_ITEM } from "../../types";
import React, { SetStateAction } from "react";
import { PhoneNumberResource } from "@clerk/types";

export type T_ADD_PHONE_NUMBER = {
  flatlistRef: AnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>;
  flatlistIndex: SharedValue<number>;
  setPhoneObj: React.Dispatch<SetStateAction<PhoneNumberResource | undefined>>;
};

export type T_ADD_PHONE_NUMBER_FIELDS = {
  mobileNumber: string;
};

export const S_ADD_PHONE_NUMBER_FIELDS = yup
  .object({
    mobileNumber: yup
      .string()
      .required(ERRORS.mobileNumber),
  })
  .required();
