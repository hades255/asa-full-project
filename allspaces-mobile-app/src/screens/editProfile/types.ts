import { ERRORS } from "@/config/constants";
import { SettingsStackParamList } from "@/navigation/settingsStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_EDIT_PROFILE_SCREEN = NativeStackScreenProps<
  SettingsStackParamList,
  "EditProfileScreen"
>;
export type T_EDIT_PROFILE_SCREEN_ROUTE_PARAMS = undefined;

export type T_EDIT_PROFILE_FIELDS = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export const S_EDIT_PROFILE_FIELDS = yup
  .object({
    firstName: yup.string().required(ERRORS.firstName),
    lastName: yup.string().required(ERRORS.lastName),
    dateOfBirth: yup.string().required(ERRORS.dateOfBirth),
  })
  .required();
