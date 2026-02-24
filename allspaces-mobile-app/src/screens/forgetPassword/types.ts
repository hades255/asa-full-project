import { ERRORS } from "@/config/constants";
import { AuthStackParamList } from "@/navigation/authStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_FORGET_PASSWORD = NativeStackScreenProps<
  AuthStackParamList,
  "ForgetPasswordScreen"
>;
export type T_FORGET_PASSWORD_ROUTE_PARAMS = undefined;

export type T_FORGET_PASSWORD_FIELDS = {
  email: string;
};

export const S_FORGET_PASSWORD_FIELDS = yup
  .object({
    email: yup.string().required(ERRORS.email).email(ERRORS.email),
  })
  .required();
