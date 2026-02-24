import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import ExportIcon from "../../images/export-icon.svg";
import profilesApis, {
  useGetProfileCategories,
  useGetProfileSubCategories,
  useProfileBasicInfo,
  useEditProfileBasicInfo,
  useGetProfile,
  PROFILE_API_ROUTES,
} from "../../api/profilesApis";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showLogMessage } from "../../utils/logs";
import { useQueryClient } from "@tanstack/react-query";
import LocationInput from "../../components/LocationInput";

function ProfileEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const { data: categories, isPending: categoriesLoading } =
  //   useGetProfileCategories();
  const { data: profile, isPending: profileLoading } = useGetProfile();
  const vendorProfile = profile?.profile;
  // const { mutateAsync: getProfileSubcategories, data: subCategories } =
  //   useGetProfileSubCategories();
  const { mutateAsync: editBasicInfoAPI, isPending: editBasicInfoAPILoading } =
    useEditProfileBasicInfo();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(FORM_ERRORS.invalidEmail).required(),
    location: Yup.mixed().required(),
    description: Yup.string().required(),
    coverMedia: Yup.mixed().required(),
    eco_score: Yup.number().required(),
    // categoryId: Yup.string().required(),
    // subcategoryId: Yup.string().required(),
  });

  // useEffect(() => {
  //   const retrieveCategories = async () => {
  //     try {
  //       const response = await profilesApis.fetchCategories();
  //       console.log("Final response categories => ", response);

  //       if (response.status === 200) {
  //         setCategories(response.data);
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   retrieveCategories();
  // }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let details = {
        name: values.name,
        description: values.description,
        email: values.email,
        location: {
          lat: values.location.geometry.location.lat(),
          lng: values.location.geometry.location.lng(),
        },
        address: values.location.formatted_address,
        coverMedia: values.coverMedia,
        eco_score: values.eco_score,
        profileId: vendorProfile.id,
      };

      await editBasicInfoAPI(details);

      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
      toast("Your profile basic info is updated successfully!", {
        type: "success",
      });
      navigate(`/user/profile`);
    } catch (err) {
      showLogMessage(`ERROR ~ ${JSON.stringify(err)}`);
    }
  };

  if (profileLoading) return null;

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Edit Profile
                </h1>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full grid grid-cols-12 gap-4 mb-4 bg-white rounded-2xl p-5">
                <div className="flex flex-col col-span-full xl:col-span-12">
                  {/* Formik Form for Basic Information */}
                  <Formik
                    initialValues={{
                      name: vendorProfile?.name || "",
                      email: vendorProfile?.email || "",
                      location: vendorProfile?.location
                        ? {
                            ...vendorProfile?.location,
                            formatted_address: vendorProfile.address,
                          }
                        : null,
                      description: vendorProfile?.description || "",
                      coverMedia: vendorProfile?.coverMedia || null,
                      eco_score: vendorProfile?.eco_score || "",
                      // categoryId: "",
                      // categories && categories.length > 0
                      //   ? categories[0].id
                      //   : "",
                      // subcategoryId: "",
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, setFieldValue }) => (
                      <Form
                        id="basic-info-form"
                        className="w-full grid grid-cols-12 gap-4 bg-white rounded-2xl p-5"
                      >
                        <div className="flex flex-col col-span-full">
                          <div className="px-5 py-3 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-black">
                              Basic Information
                            </h2>
                          </div>

                          <div className="w-full grow px-5 pt-3 pb-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Name
                              </label>
                              <Field
                                name="name"
                                type="text"
                                placeholder="Hotel Name"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black placeholder-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              />
                              {errors.name && touched.name && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.name}
                                </div>
                              )}
                            </div>

                            {/* Email */}
                            <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Email
                              </label>
                              <Field
                                name="email"
                                type="email"
                                placeholder="john@gmail.com"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black placeholder-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              />
                              {errors.email && touched.email && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.email}
                                </div>
                              )}
                            </div>

                            {/* Cover Media */}
                            <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Cover Media
                              </label>
                              <div className="h-14 flex items-center bg-extraLightLight rounded-full px-4 py-2">
                                <input
                                  name="coverMedia"
                                  type="file"
                                  accept=".jpg, .png, .jpeg"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "coverMedia",
                                      e.currentTarget.files[0]
                                    );
                                  }}
                                  className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                />
                                <img
                                  src={ExportIcon}
                                  alt=""
                                  className=""
                                  size={20}
                                />
                              </div>
                              <span className="text-lightGray">
                                {profile.coverMedia}
                              </span>
                              {errors.coverMedia && touched.coverMedia && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.coverMedia}
                                </div>
                              )}
                            </div>

                            {/* Location */}
                            <LocationInput
                              label={`Location`}
                              placeholder="Lorem Ipsum"
                              name="location"
                            />
                            {/* <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Location
                              </label>
                              <Field
                                name="location"
                                type="text"
                                placeholder="Lorem Ipsum"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black placeholder-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              />
                              {errors.location && touched.location && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.location}
                                </div>
                              )}
                            </div> */}

                            {/* Eco Store */}
                            <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Eco Store
                              </label>
                              <Field
                                name="eco_score"
                                type="number"
                                placeholder="Enter Eco Store"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black placeholder-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              />
                              {errors.eco_score && touched.eco_score && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.eco_score}
                                </div>
                              )}
                            </div>

                            {/* Status */}
                            {/* <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Status
                              </label>
                              <Field
                                as="select"
                                name="status"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              >
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="PUBLISHED">PUBLISHED</option>
                              </Field>
                              {errors.status && touched.status && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.status}
                                </div>
                              )}
                            </div> */}

                            {/* Category */}
                            {/* <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Category
                              </label>
                              <Field
                                as="select"
                                name="categoryId"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                onChange={async (e) => {
                                  const categoryId = e.target.value;
                                  setFieldValue("categoryId", categoryId);
                                  setFieldValue("subcategoryId", ""); // Reset subcategory
                                  await getProfileSubcategories(categoryId);
                                }}
                              >
                                <option value="">Select Category</option>
                                {categories &&
                                  categories.map((category) => {
                                    return (
                                      <option
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.title}
                                      </option>
                                    );
                                  })}
                              </Field>
                              {errors.categoryId && touched.categoryId && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.categoryId}
                                </div>
                              )}
                            </div> */}

                            {/* Sub Category */}
                            {/* {subCategories && subCategories.length ? (
                              <div>
                                <label className="block text-black text-base font-medium mb-2 pl-4">
                                  Sub Category
                                </label>
                                <Field
                                  as="select"
                                  name="subcategoryId"
                                  className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                >
                                  <option value="">Select Sub Category</option>
                                  {subCategories.map((subcategory) => {
                                    return (
                                      <option
                                        key={subcategory.id}
                                        value={subcategory.id}
                                      >
                                        {subcategory.title}
                                      </option>
                                    );
                                  })}
                                </Field>
                                {errors.subcategoryId &&
                                  touched.subcategoryId && (
                                    <div className="text-red-500 text-sm pl-4">
                                      {errors.subcategoryId}
                                    </div>
                                  )}
                              </div>
                            ) : null} */}

                            {/* Description */}
                            <div className="w-full col-span-full">
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Description
                              </label>
                              <Field
                                as="textarea"
                                name="description"
                                rows="5"
                                placeholder="Lorem Ipsum..."
                                className="flex items-center bg-extraLightLight rounded-2xl w-full text-base font-normal text-black placeholder-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              />
                              {errors.description && touched.description && (
                                <div className="text-red-500 text-sm pl-4">
                                  {errors.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="submit"
                            form="basic-info-form"
                            className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4 mt-4"
                            disabled={editBasicInfoAPILoading}
                          >
                            {editBasicInfoAPILoading
                              ? "Just a moment..."
                              : `Save`}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfileEdit;
