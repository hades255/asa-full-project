import { ERRORS } from "@/config/constants";
import * as yup from "yup";

export type T_PERSONAL_INFO = {
  onNext: () => void;
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
