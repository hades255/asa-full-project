import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import usersApis, { useCreateEmployee } from "../../api/usersApis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  role: "EMPLOYEE",
  password: "",
  status: "ACTIVE",
};

function UserForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigate();

  const { mutateAsync: createEmployeeAPI, isPending: createLoading } =
    useCreateEmployee();

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
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
      console.log("details", details);

      await createEmployeeAPI(details);
      toast(`Employee is created successfully!`, { type: "success" });
      resetForm();
      navigation("/vendor/users");
    } catch (error) {
      toast(`${error}`, { type: "error" });
    }
  };

  return (
    <div className="flex h-[100dvh] bg-extraLightLight overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-4">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  <span>Add New User</span>
                </h1>
              </div>
            </div>

            {/* Add New User Form */}
            <div className="text-base font-normal bg-white text-black rounded-xl shadow overflow-hidden p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="name"
                        >
                          Name
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="phone"
                        >
                          Phone
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="Phone"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="role"
                        >
                          Role
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            as="select"
                            id="role"
                            name="role"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          >
                            <option value="EMPLOYEE">EMPLOYEE</option>
                          </Field>
                        </div>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          className="block text-black text-sm font-medium mb-2 pl-4"
                          htmlFor="status"
                        >
                          Status
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            as="select"
                            id="status"
                            name="status"
                            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray p-0 border-none focus:border-none focus:outline-none focus:ring-0"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BLOCKED">BLOCKED</option>
                          </Field>
                        </div>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm pl-4"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-9 bg-black text-white text-center py-3 rounded-full text-base font-medium"
                      disabled={createLoading}
                    >
                      {createLoading ? "Creating..." : "Create"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserForm;
