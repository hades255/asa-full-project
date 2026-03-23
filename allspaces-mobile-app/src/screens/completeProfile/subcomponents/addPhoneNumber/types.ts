import { ERRORS } from "@/config/constants";
import * as yup from "yup";
import React, { SetStateAction } from "react";
import { PhoneNumberResource } from "@clerk/types";

export type T_ADD_PHONE_NUMBER = {
  setPhoneObj: React.Dispatch<SetStateAction<PhoneNumberResource | undefined>>;
  onNext: () => void;
  onGoToStep: (step: number) => void;
};

export type T_ADD_PHONE_NUMBER_FIELDS = {
  mobileNumber: string;
};

export const S_ADD_PHONE_NUMBER_FIELDS = yup
  .object({
    mobileNumber: yup
      .string()
      .required(ERRORS.mobileNumber),
  })
  .required();
