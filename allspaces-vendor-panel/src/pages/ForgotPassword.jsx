import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, useFormik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for validation

import OnboardingIntoPanel from "./component/OnboardingIntoPanel";
import MailIcon from "../images/sms-icon.svg";
import { useForgotPassword } from "../api/authApis";
import { toast } from "react-toastify";
import { FORM_ERRORS } from "../utils/formErrors";
import { showLogMessage } from "../utils/logs";
import { Sms } from "iconsax-react";
import { AppButton, AppInput } from "../components";

function ForgotPassword() {
  const navigate = useNavigate();

  const {
    mutateAsync: forgotPasswordAPI,
    isPending: forgotPasswordAPILoading,
  } = useForgotPassword();

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(FORM_ERRORS.invalidEmail)
      .required(FORM_ERRORS.requiredEmail)
      .trim()
      .lowercase(),
  });

  // Handle form submission
  const handleSubmit = async (values, {}) => {
    try {
      const response = await forgotPasswordAPI({
        email: values.email.trim().toLowerCase(),
      });

      toast(`OTP is sent to your Email. OTP is ${response.otp}`, {
        type: "success",
      });
      navigate(
        `/email-verification?email=${values.email
          .trim()
          .toLowerCase()}&reset_password=true`
      );
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-9 ">
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-heading2 font-semibold text-semantic-content-contentPrimary">{`Forgot your password?`}</h2>
        <p className="text-body1 font-normal text-semantic-content-contentInverseTertionary">{`Enter your email to reset your password`}</p>
      </div>

      <div className="flex flex-1 items-center justify-center w-full">
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex-1 flex flex-col items-center gap-y-9 max-w-[400px]">
            <div className="flex flex-col gap-y-4 w-full items-center">
              <AppInput
                id={`email`}
                label={`Email`}
                placeholder={`e.g johndoe@gmail.com`}
                name={`email`}
                type={`email`}
                icon={<Sms size={24} />}
              />
            </div>
            <div className="w-full">
              <AppButton
                title={`Continue`}
                type={`submit`}
                loading={forgotPasswordAPILoading}
              />
              <AppButton
                variant="textBtn"
                title={`Go Back`}
                onClick={() => {
                  navigate(-1);
                }}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative min-h-screen flex md:flex-row flex-col overflow-hidden">
        {/* Left Section */}
        <OnboardingIntoPanel />

        {/* Content Section */}
        <div className="md:w-1/2 w-full p-8 md:p-14 flex flex-col justify-between min-h-screen">
          {/* Header */}
          <div className="flex justify-end space-x-4 mb-6">
            <Link
              to="/signin"
              className="text-black hover:text-black underline-none py-2 px-4 text-base font-medium hover:underline-none"
            >
              Login
            </Link>
            <Link
              to="/contact-us"
              className="text-black hover:text-black underline-none py-2 px-4 text-base font-medium hover:underline-none"
            >
              Contact Support
            </Link>
          </div>

          {/* Forgot Password Form */}
          <div className="max-w-sm mx-auto flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-semibold text-center mb-2 text-black">
              Forgot your password?
            </h1>
            <p className="text-center text-base text-lightGray mb-6">
              Enter your email to reset your password.
            </p>

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                {/* Email Input Field */}
                <div>
                  <label
                    className="block text-black text-sm font-medium mb-2 pl-4"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div
                    className="flex items-center bg-extraLightLight rounded-full px-4 py-2 gap-4 border 
                    ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-transparent'}"
                  >
                    <img src={MailIcon} alt="Email" size={20} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="johndoe@gmail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-9 bg-black text-white text-center py-3 rounded-full text-base font-medium"
                disabled={forgotPasswordAPILoading}
              >
                {forgotPasswordAPILoading ? "Just a moment..." : "Continue"}
              </button>

              <Link
                to="#"
                onClick={() => navigate(-1)}
                className="block text-base font-medium text-black text-center underline-none focus:underline-none mt-4"
              >
                Go Back
              </Link>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
