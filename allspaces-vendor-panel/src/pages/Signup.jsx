import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { useSignup } from "../api/authApis";
import { FORM_ERRORS } from "../utils/formErrors";
import { showLogMessage, showToast } from "../utils/logs";
import { AppButton, AppInput } from "../components";
import { Lock1, Sms } from "iconsax-react";
import { saveInSecureLS, SECURE_LS_TOKENS } from "../utils/secureLs";

function Signup() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(FORM_ERRORS.invalidEmail)
      .required(FORM_ERRORS.requiredEmail)
      .trim()
      .lowercase(),
    password: Yup.string()
      .min(6, FORM_ERRORS.passwordLength)
      .required(FORM_ERRORS.requiredPassword),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], FORM_ERRORS.confirmPassword)
      .required(FORM_ERRORS.requiredConfirmPassword),
  });
  const { mutateAsync: signupAPI, isPending: signupAPILoading } = useSignup();

  const handleSubmit = async (values) => {
    try {
      let details = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      const response = await signupAPI(details);

      showToast(`Please verify your Email. OTP is ${response.otp}`, `success`);
      navigate(`/email-verification?email=${details.email}`);
      saveInSecureLS(SECURE_LS_TOKENS.SIGNUP_PASSWORD, values.password);
    } catch (err) {
      showLogMessage(`ERROR ~ ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-9 ">
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-heading2 font-semibold text-semantic-content-contentPrimary">{`Create an account`}</h2>
        <p className="text-body1 font-normal text-semantic-content-contentInverseTertionary">{`Enter following details to create your account`}</p>
      </div>
      <div className="flex flex-1 items-center justify-center w-full">
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirm_password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex-1 flex flex-col items-center gap-y-9 max-w-[400px]">
            <div className="flex flex-col gap-y-4 w-full items-center">
              <AppInput
                width={400}
                id={`email`}
                label={`Email`}
                placeholder={`e.g johndoe@gmail.com`}
                name={`email`}
                type={`email`}
                icon={<Sms size={24} />}
              />
              <AppInput
                width={400}
                id={`password`}
                label={`password`}
                placeholder={`********`}
                name={`password`}
                type={`password`}
                icon={<Lock1 size={24} />}
              />

              <AppInput
                width={400}
                id={`confirm_password`}
                label={`Confirm Password`}
                placeholder={`********`}
                name={`confirm_password`}
                type={`password`}
                icon={<Lock1 size={24} />}
              />
            </div>
            <AppButton
              title={`Continue`}
              type={`submit`}
              loading={signupAPILoading}
              onClick={handleSubmit}
            />
          </Form>
        </Formik>
      </div>
      <p className="text-semantic-content-contentInverseTertionary text-body1 font-normal text-center">
        {`By clicking continue, you agree to our `}
        <br />
        <Link to="/terms-conditions" className="underline">
          {`Terms of Service`}
        </Link>
        {` and `}
        <Link to="/privacy-policy" className="underline">
          {`Privacy Policy`}
        </Link>
      </p>
    </div>
  );
}

export default Signup;
