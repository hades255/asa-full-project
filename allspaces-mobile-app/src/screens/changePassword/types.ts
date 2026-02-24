import { ERRORS } from "@/config/constants";
import { SettingsStackParamList } from "@/navigation/settingsStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_CHANGE_PASSWORD_SCREEN = NativeStackScreenProps<
  SettingsStackParamList,
  "ChangePasswordScreen"
>;
export type T_CHANGE_PASSWORD_SCREEN_ROUTE_PARAMS = undefined;

export type T_CHANGE_PASSWORD_FIELDS = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const S_CHANGE_PASSWORD_FIELDS = yup
  .object({
    currentPassword: yup
      .string()
      .required(ERRORS.password)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ERRORS.password
      ),
    newPassword: yup
      .string()
      .required(ERRORS.password)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ERRORS.password
      ),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], ERRORS.confirmPassword)
      .required(ERRORS.confirmPassword),
  })
  .required();
