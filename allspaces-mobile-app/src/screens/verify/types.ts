import { AuthStackParamList } from "@/navigation/authStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_VERIFY_SCREEN = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyScreen"
>;
export type T_VERIFY_SCREEN_ROUTE_PARAMS = {
  type: "email" | "phone";
  credential: string;
};

export type T_VERIFY_FIELDS = {
  code: string;
};

export const S_VERIFY_FIELDS = yup
  .object({
    code: yup.string().required().length(6),
  })
  .required();
