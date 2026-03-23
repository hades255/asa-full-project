import { ERRORS } from "@/config/constants";
import { AuthStackParamList } from "@/navigation/authStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_RESET_PASSWORD_SCREEN = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPasswordScreen"
>;
export type T_RESET_PASSWORD_SCREEN_ROUTE_PARAMS = {
  email: string;
};

export type T_RESET_PASSWORD_FIELDS = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export const S_RESET_PASSWORD_FIELDS = yup
  .object({
    code: yup.string().required().length(6),
    newPassword: yup
      .string()
      .required(ERRORS.password)
      .min(8, ERRORS.password),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   ERRORS.password
      // ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], ERRORS.confirmPassword)
      .required(ERRORS.confirmPassword),
  })
  .required();
