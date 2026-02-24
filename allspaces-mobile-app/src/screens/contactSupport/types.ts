import { ERRORS } from "@/config/constants";
import { SettingsStackParamList } from "@/navigation/settingsStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_CONTACT_SUPPORT_SCREEN = NativeStackScreenProps<
  SettingsStackParamList,
  "ContactSupportScreen"
>;
export type T_CONTACT_SUPPORT_SCREEN_ROUTE_PARAMS = undefined;

export type T_CONTACT_SUPPORT_FIELDS = {
  subject: string;
  message: string;
};

export const S_CONTACT_SUPPORT_FIELDS = yup
  .object({
    subject: yup.string().required(ERRORS.subject),
    message: yup.string().required(ERRORS.generalMessage),
  })
  .required();
