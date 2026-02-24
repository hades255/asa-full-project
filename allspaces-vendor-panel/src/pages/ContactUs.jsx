import { FORM_ERRORS } from "../utils/formErrors";
import * as Yup from "yup";
import { showLogMessage, showToast } from "../utils/logs";
import { Form, Formik } from "formik";
import { AppButton, AppInput } from "../components";
import { useContactSupport } from "../api/contactsApis";
import { useNavigate } from "react-router-dom";

export const ContactUs = () => {
  const { mutateAsync: contactSupportAPI, isPending } = useContactSupport();
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    subject: Yup.string().required(FORM_ERRORS.requiredSubject).trim(),
    message: Yup.string().required(FORM_ERRORS.requiredMessage).trim(),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await contactSupportAPI(values);
      showToast(`Your message is sent successfully!`, "success");
      resetForm();
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-1 h-full flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`Contact Support`}</h1>
      </div>
      <div className="flex flex-1 bg-semantic-background-backgroundPrimary rounded-2xl shadow-md p-6 overflow-y-auto">
        <Formik
          initialValues={{
            subject: "",
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex-1 flex flex-col gap-y-9">
            <div className="flex flex-col gap-y-4 w-full">
              <AppInput
                id={`subject`}
                label={`Subject`}
                placeholder={`e.g handling pending bookings`}
                name={`subject`}
                type={`text`}
              />
              <AppInput
                id={`message`}
                label={`Message`}
                placeholder={`Start typing here...`}
                name={`message`}
                type={`textarea`}
              />
            </div>
            <div className="flex items-center justify-center gap-x-3 lg:justify-end">
              <AppButton
                width={`w-full lg:w-[124px]`}
                title={`Continue`}
                type={`submit`}
                loading={isPending}
              />
              <AppButton
                width={`w-full lg:w-[124px]`}
                title={`Cancel`}
                variant="textBtn"
                onClick={() => navigate(-1)}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
