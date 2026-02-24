import { ERRORS } from "@/config/constants";
import { AuthStackParamList } from "@/navigation/authStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_LOGIN_SCREEN = NativeStackScreenProps<
  AuthStackParamList,
  "LoginScreen"
>;
export type T_LOGIN_SCREEN_ROUTE_PARAMS = undefined;

export type T_LOGIN_FIELDS = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const S_LOGIN_FIELDS = yup
  .object({
    email: yup.string().required(ERRORS.email).email(ERRORS.email),
    password: yup
      .string()
      .required(ERRORS.password)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ERRORS.password
      ),
    rememberMe: yup.boolean().optional().default(false),
  })
  .required();
