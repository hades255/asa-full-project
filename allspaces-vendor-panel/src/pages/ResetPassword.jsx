import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "../api/authApis";
import { toast } from "react-toastify";
import { FORM_ERRORS } from "../utils/formErrors";
import { showLogMessage } from "../utils/logs";
import { AppButton, AppInput } from "../components";
import { Lock1 } from "iconsax-react";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const { mutateAsync: resetPasswordAPI, isPending: resetPasswordAPILoading } =
    useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let emailParam = searchParams.get("email") || "";
    emailParam.replace(/ /g, "+");
    setEmail(emailParam.replace(/ /g, "+"));
  }, []);

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, FORM_ERRORS.passwordLength)
      .required(FORM_ERRORS.requiredPassword),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], FORM_ERRORS.confirmPassword)
      .required(FORM_ERRORS.requiredConfirmPassword),
  });

  const handleSubmit = async (values, {}) => {
    try {
      await resetPasswordAPI({ email, newPassword: values.password });

      toast("Password has been changed successfully. Please Login now!", {
        type: "success",
      });
      navigate("/signin");
    } catch (error) {
      showLogMessage(`ERROR ~ ${error}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-9 ">
      <div className="flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-heading2 font-semibold text-semantic-content-contentPrimary">{`Reset your password`}</h2>
        <p className="text-body1 font-normal text-semantic-content-contentInverseTertionary">{`Please set a new password`}</p>
      </div>

      <div className="flex flex-1 items-center justify-center w-full">
        <Formik
          initialValues={{
            password: "",
            confirm_password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex-1 flex flex-col items-center gap-y-9 max-w-[400px]">
            <div className="flex flex-col gap-y-4 w-full items-center">
              <AppInput
                id={`password`}
                label={`Password`}
                placeholder={`********`}
                name={`password`}
                type={`password`}
                icon={<Lock1 size={24} />}
              />
              <AppInput
                id={`confirm_password`}
                label={`Confirm Password`}
                placeholder={`********`}
                name={`confirm_password`}
                type={`password`}
                icon={<Lock1 size={24} />}
              />
            </div>
            <div className="w-full">
              <AppButton
                title={`Continue`}
                type={`submit`}
                loading={resetPasswordAPILoading}
              />
              <AppButton
                title={`Go Back`}
                variant={`textBtn`}
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
}

export default ResetPassword;
