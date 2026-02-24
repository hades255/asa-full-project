import React from "react";
import { FORM_ERRORS } from "../../utils/formErrors";
import * as Yup from "yup";
import { useChangePassword } from "../../api/authApis";
import { SECURE_LS_TOKENS } from "../../utils/secureLs";
import { showLogMessage } from "../../utils/logs";
import { Form, Formik } from "formik";
import { AppButton, AppInput } from "../../components";
import { Lock1 } from "iconsax-react";

export const ProfileSecurity = () => {
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(6, FORM_ERRORS.passwordLength)
      .required(FORM_ERRORS.requiredPassword),
    newPassword: Yup.string()
      .min(6, FORM_ERRORS.passwordLength)
      .required(FORM_ERRORS.requiredPassword),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], FORM_ERRORS.confirmPassword)
      .required(FORM_ERRORS.requiredConfirmPassword),
  });

  const { mutateAsync: updatePasswordAPI, isPending: updatePasswordLoading } =
    useChangePassword();

  const handleSubmit = async (values) => {
    try {
      console.log("values", values);

      await updatePasswordAPI({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      showToast(`Password is changed successully.`, `success`);
      saveInSecureLS(SECURE_LS_TOKENS.SIGNUP_PASSWORD, values.newPassword);
    } catch (err) {
      showLogMessage(`ERROR ~ ${JSON.stringify(err)}`);
    }
  };
  return (
    <div className="flex flex-1 flex-col w-full h-full overflow-y-auto">
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex flex-col items-center gap-y-9 max-w-[400px]">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <AppInput
              width={400}
              id={`currentPassword`}
              label={`Current Password`}
              placeholder={`********`}
              name={`currentPassword`}
              type={`password`}
              icon={<Lock1 size={24} />}
            />

            <AppInput
              width={400}
              id={`newPassword`}
              label={`New Password`}
              placeholder={`********`}
              name={`newPassword`}
              type={`password`}
              icon={<Lock1 size={24} />}
            />

            <AppInput
              width={400}
              id={`confirmNewPassword`}
              label={`Confirm New Password`}
              placeholder={`********`}
              name={`confirmNewPassword`}
              type={`password`}
              icon={<Lock1 size={24} />}
            />
          </div>
          <AppButton
            title={`Continue`}
            type={`submit`}
            loading={updatePasswordLoading}
            onClick={handleSubmit}
          />
        </Form>
      </Formik>
    </div>
  );
};
