import * as yup from "yup";
import { PhoneNumberResource } from "@clerk/types";

export type T_VERIFY_PHONE_NUMBER = {
  phoneObj: PhoneNumberResource | undefined;
  onNext: () => void;
  onPrev: () => void;
};

export type T_VERIFY_PHONE_NUMBER_FIELDS = {
  code: string;
};

export const S_VERIFY_PHONE_NUMBER_FIELDS = yup
  .object({
    code: yup.string().required().length(6),
  })
  .required();
