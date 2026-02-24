import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLogin } from "../api/authApis";
import { useAuth } from "../context/AuthContext";
import { FORM_ERRORS } from "../utils/formErrors";
import {
  getFromSecureLS,
  removeFromSecureLS,
  saveInSecureLS,
  SECURE_LS_TOKENS,
} from "../utils/secureLs";
import { showLogMessage, showToast } from "../utils/logs";
import { AppButton, AppCheckbox, AppInput } from "../components";
import { Lock1, Sms } from "iconsax-react";

function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutateAsync: loginAPI, isPending: loginAPILoading } = useLogin();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(FORM_ERRORS.invalidEmail)
      .required(FORM_ERRORS.requiredEmail)
      .trim()
      .lowercase(),
    password: Yup.string().required(FORM_ERRORS.requiredPassword),
    rememberMe: Yup.boolean().optional().default(true),
  });

  // Handle form submission
  const handleSubmit = async (values, {}) => {
    try {
      const response = await loginAPI({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      showToast("You are logged in successfully!", "success");
      login(response);

      navigate("/", {
        replace: true,
      });

      if (values.rememberMe) {
        saveInSecureLS(
          SECURE_LS_TOKENS.USER_EMAIL,
          values.email.trim().toLowerCase()
        );
        saveInSecureLS(SECURE_LS_TOKENS.USER_PASSWORD, values.password);
      } else {
        removeFromSecureLS(SECURE_LS_TOKENS.USER_EMAIL);
        removeFromSecureLS(SECURE_LS_TOKENS.USER_PASSWORD);
      }
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-9 ">
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-heading2 font-semibold text-semantic-content-contentPrimary">{`Login`}</h2>
        <p className="text-body1 font-normal text-semantic-content-contentInverseTertionary">{`Enter following details to login into your account`}</p>
      </div>

      <div className="flex flex-1 items-center justify-center w-full">
        <Formik
          initialValues={{
            email: getFromSecureLS(SECURE_LS_TOKENS.USER_EMAIL) || "",
            password: getFromSecureLS(SECURE_LS_TOKENS.USER_PASSWORD) || "",
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

              <div className="flex items-center justify-between w-full">
                <AppCheckbox label={`Remember me`} name={`rememberMe`} />
                <Link
                  to={"/forgot-password"}
                  className="font-normal text-body1 text-semantic-content-contentPrimary underline"
                >
                  {`forgot password?`}
                </Link>
              </div>
            </div>
            <AppButton
              title={`Continue`}
              type={`submit`}
              loading={loginAPILoading}
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

export default Signin;
