import * as Yup from "yup";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showToast } from "../../utils/logs";
import { AppButton, AppInput } from "../../components";
import { Form, Formik } from "formik";
import { useAddProfileFacility } from "../../api/profilesApis";
import { useAuth } from "../../context/AuthContext";
import { saveInSecureLS, SECURE_LS_TOKENS } from "../../utils/secureLs";

export const Facility = ({ setStep }) => {
  const { profile } = useAuth();
  const { mutateAsync: addFacilityAPI, isPending: addFacilityLoading } =
    useAddProfileFacility();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_ERRORS.invalidName),
  });

  const handleSubmit = async (values, {}) => {
    try {
      if (!profile) return;
      await addFacilityAPI({
        profileId: profile.profile.id,
        name: values.name,
      });
      showToast(`Facility is added`, "success");
      setStep((prev) => ++prev);
      saveInSecureLS(SECURE_LS_TOKENS.PROFILE_STEP, "3");
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };
  return (
    <div className="flex flex-1 flex-col w-full h-full items-center p-5">
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex w-full flex-col items-center gap-y-9 lg:max-w-[600px] max-w-[400px]">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <AppInput
              id={"name"}
              name={"name"}
              label={`Facility`}
              placeholder={`e.g. Smoking Area`}
            />
          </div>
          <AppButton
            type={"submit"}
            title={`Continue`}
            loading={addFacilityLoading}
          />
        </Form>
      </Formik>
    </div>
  );
};
