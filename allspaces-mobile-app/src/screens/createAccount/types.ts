import { ERRORS } from "@/config/constants";
import { AuthStackParamList } from "@/navigation/authStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_CREATE_ACCOUNT_SCREEN = NativeStackScreenProps<
  AuthStackParamList,
  "CreateAccountScreen"
>;
export type T_CREATE_ACCOUNT_SCREEN_ROUTE_PARAMS = undefined;

export type T_CREATE_ACCOUNT_FIELDS = {
  email: string;
  password: string;
  confirmPassword: string;
  privacyTermsCheck: boolean;
};

export const S_CREATE_ACCOUNT_FIELDS = yup
  .object({
    email: yup.string().required(ERRORS.email).email(ERRORS.email),
    password: yup
      .string()
      .required(ERRORS.password)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ERRORS.password
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], ERRORS.confirmPassword)
      .required(ERRORS.confirmPassword),
    privacyTermsCheck: yup
      .boolean()
      .required(
        `Please check Privacy Policy and Terms Condition before proceeding`
      ),
  })
  .required();
