import * as Yup from "yup";
import { FORM_ERRORS } from "../../utils/formErrors";
import {
  useCreateEmployee,
  useEditEmployee,
  USER_API_ROUTES,
} from "../../api/usersApis";
import { showToast } from "../../utils/logs";
import { Form, Formik } from "formik";
import { Modal } from "../../components/Modal";
import { AppButton, AppInput } from "../../components";
import { Call, Lock, Sms, User } from "iconsax-react";
import AppSelect from "../../components/new/AppSelect";
import { useQueryClient } from "@tanstack/react-query";

export const EmployeeForm = ({
  employee,
  setEmployee,
  modalOpen,
  setModalOpen,
}) => {
  const { mutateAsync: createEmployeeAPI, isPending: createLoading } =
    useCreateEmployee();
  const { mutateAsync: editEmployeeAPI, isPending: editLoading } =
    useEditEmployee();

  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    name: Yup.string().required(FORM_ERRORS.invalidName),
    email: Yup.string()
      .email(FORM_ERRORS.invalidEmail)
      .required(FORM_ERRORS.requiredEmail),
    phone: Yup.string().required(FORM_ERRORS.invalidPhone),
    role: Yup.string()
      .oneOf(["EMPLOYEE"], "Role must be employee")
      .required(FORM_ERRORS.requiredRole),
    password: Yup.string().required(FORM_ERRORS.requiredPassword),
    status: Yup.string()
      .oneOf(["ACTIVE", "BLOCKED"], "Status should be Active or Blocked")
      .required(FORM_ERRORS.requiredStatus),
  });

  const STATUS_OPTIONS = [
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "BLOCKED", value: "BLOCKED" },
  ];

  const ROLE_OPTIONS = [{ label: "EMPLOYEE", value: "EMPLOYEE" }];

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { name, email, phone, role, password, status } = values;
      let details = {
        name,
        email,
        phone,
        role,
        password,
        status,
      };
      if (employee) {
        // Edit Employee
        await editEmployeeAPI({ id: employee.id, data: details });
      } else {
        // Adding New Employee
        await createEmployeeAPI(details);
      }

      showToast(
        `Employee is ${employee ? "edited" : "created"} successfully!`,
        "success"
      );
      resetForm();
      setModalOpen((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: [USER_API_ROUTES.GET_EMPLOYEES],
      });
      setEmployee(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen((prev) => !prev)}
      title={`${employee ? `Edit` : `Add`} Employee`}
    >
      <Formik
        initialValues={{
          name: employee?.first_name || "",
          email: employee?.email || "",
          phone: employee?.phone || "",
          role: employee?.roles[0] || "",
          password: employee?.password || "",
          status: employee?.status || "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex flex-col items-center gap-y-9">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <AppInput
              id={`name`}
              label={`Full Name`}
              placeholder={`e.g John Doe`}
              name={`name`}
              type={`name`}
              icon={<User size={24} />}
            />
            <AppInput
              id={`phone`}
              label={`Phone`}
              placeholder={`e.g +92123456789`}
              name={`phone`}
              type={`phone`}
              icon={<Call size={24} />}
            />
            <AppInput
              id={`email`}
              label={`Email`}
              placeholder={`e.g johndoe@gmail.com`}
              name={`email`}
              type={`email`}
              icon={<Sms size={24} />}
            />
            <AppInput
              id={`password`}
              label={`Password`}
              placeholder={`********`}
              name={`password`}
              type={`password`}
              icon={<Lock size={24} />}
            />
            <AppSelect
              id="role"
              name="role"
              label="Role"
              placeholder="Select Role"
              options={ROLE_OPTIONS}
            />
            <AppSelect
              id="status"
              name="status"
              label="Status"
              placeholder="Select Status"
              options={STATUS_OPTIONS}
            />
          </div>
          <AppButton
            type={"submit"}
            title={"Continue"}
            loading={createLoading || editLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
};
