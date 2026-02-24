import { useQueryClient } from "@tanstack/react-query";
import {
  PROFILE_API_ROUTES,
  useAddProfileFacility,
  useEditProfileFacility,
} from "../../api/profilesApis";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showToast } from "../../utils/logs";
import { Modal } from "../../components/Modal";
import { AppButton, AppInput } from "../../components";
import { Form, Formik } from "formik";

export const FacilityForm = ({
  facility,
  setFacility,
  modalOpen,
  setModalOpen,
}) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: addFacilityAPI, isPending: addFacilityLoading } =
    useAddProfileFacility();

  const { mutateAsync: editFacilityAPI, isPending: editFacilityLoading } =
    useEditProfileFacility();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_ERRORS.invalidName),
  });

  const handleSubmit = async (values, {}) => {
    try {
      if (!profile) return;
      if (facility) {
        await editFacilityAPI({
          profileId: profile.profile.id,
          facilityId: facility.id,
          name: values.name,
        });
      } else {
        await addFacilityAPI({
          profileId: profile.profile.id,
          name: values.name,
        });
      }
      showToast(`Facility is ${facility ? "edited" : "added"}`, "success");
      setModalOpen((prev) => !prev);
      setFacility(null);
      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };
  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen((prev) => !prev);
        setFacility(null);
      }}
      title={`${facility ? `Edit` : `Add`} Facility`}
    >
      <Formik
        initialValues={{
          name: facility?.name || "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex flex-col items-center gap-y-9">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <AppInput
              id={`name`}
              label={`Facility Name`}
              placeholder={`e.g Smoking`}
              name={`name`}
              type={`name`}
            />
          </div>
          <AppButton
            type={"submit"}
            title={"Continue"}
            loading={addFacilityLoading || editFacilityLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
};
