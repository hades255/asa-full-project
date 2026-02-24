import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSignup, useVerifyOTP } from "../api/authApis";
import { FORM_ERRORS } from "../utils/formErrors";
import { showLogMessage, showToast } from "../utils/logs";
import { AppButton, OtpInput } from "../components";
import {
  getFromSecureLS,
  saveInSecureLS,
  SECURE_LS_TOKENS,
} from "../utils/secureLs";
import { Bars } from "react-loader-spinner";

const INITIAL_COUNTDOWN = 59;

function OTP() {
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const [resetPasswordFlow, setResetPasswordFlow] = useState(false);
  const [timer, setTimer] = useState(INITIAL_COUNTDOWN); // Initial countdown time
  const [isDisabled, setIsDisabled] = useState(true);

  const navigate = useNavigate();

  const { mutateAsync: signupAPI, isPending: signupAPILoading } = useSignup();
  const { mutateAsync: verifyOTPAPI, isPending: verifyOTPAPILoading } =
    useVerifyOTP();

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(4, FORM_ERRORS.otpLength)
      .matches(/^\d{4}$/, FORM_ERRORS.otpLength)
      .required(FORM_ERRORS.requiredOTP),
  });

  // Getting Email and Type form Search Params
  useEffect(() => {
    let emailParam = searchParams.get("email") || "";
    emailParam.replace(/ /g, "+");
    setEmail(emailParam.replace(/ /g, "+"));
    setResetPasswordFlow(searchParams.get("reset_password") || false);
  }, []);

  // Hook for countdown
  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(false);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const resendCode = async () => {
    try {
      let details = {
        email: email,
        password: getFromSecureLS(SECURE_LS_TOKENS.SIGNUP_PASSWORD),
      };
      const response = await signupAPI(details);
      showToast(`Please verify your Email. OTP is ${response.otp}`, `success`);
      setTimer(INITIAL_COUNTDOWN);
      setIsDisabled(true);
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await verifyOTPAPI({
        email: email.trim().toLowerCase(),
        otp: values.otp,
        type: resetPasswordFlow ? "reset-password" : "account-confirm",
      });

      if (resetPasswordFlow) {
        showToast(`OTP is verified successfully`, "success");
        navigate(`/reset-password?email=${email}`);
      } else {
        saveInSecureLS(SECURE_LS_TOKENS.USER_EMAIL, email);
        saveInSecureLS(
          SECURE_LS_TOKENS.USER_PASSWORD,
          getFromSecureLS(SECURE_LS_TOKENS.SIGNUP_PASSWORD)
        );
        showToast(
          "Account is created successully. Now You can Login!",
          "success"
        );
        navigate("/signin");
      }
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-9 ">
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-heading2 font-semibold text-semantic-content-contentPrimary">{`Verify your email`}</h2>
        <div className="text-center">
          <span className="text-body1 font-normal text-semantic-content-contentInverseTertionary">
            {`An otp is sent to your `}
          </span>
          <span className="text-body1 font-normal text-semantic-content-contentPrimary">{`${email}.`}</span>
          <br />
          <span className="text-body1 font-normal text-semantic-content-contentInverseTertionary">
            {`Enter code to continue`}
          </span>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center w-full">
        <Formik
          initialValues={{
            otp: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex-1 w-full flex flex-col items-center gap-y-9">
              <div className="flex flex-col gap-y-4 w-full items-center justify-center">
                <OtpInput
                  name={`otp`}
                  values={values}
                  setFieldValue={setFieldValue}
                  id={`otp`}
                />
                {signupAPILoading ? (
                  <Bars
                    height="24"
                    width="24"
                    color="#000"
                    ariaLabel="bars-loading"
                    visible={true}
                  />
                ) : isDisabled ? (
                  <div className="text-center">
                    <span className="font-normal text-body1 text-semantic-content-contentInverseTertionary">{`Resend in `}</span>
                    <span className="font-normal text-body1 text-semantic-content-contentPrimary">{`${timer}`}</span>
                  </div>
                ) : (
                  <p
                    onClick={resendCode}
                    className="font-normal text-body1 text-semantic-content-contentPrimary underline cursor-pointer text-center"
                  >{`Resend`}</p>
                )}
              </div>
              <div className="max-w-[400px] w-full">
                <AppButton
                  title={`Continue`}
                  type={`submit`}
                  loading={verifyOTPAPILoading}
                />
                <AppButton
                  title={`Go Back`}
                  variant="textBtn"
                  onClick={() => navigate(-1)}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default OTP;
