import { useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import ExportIcon from "../../images/export-icon.svg";
import { useProfileBasicInfo } from "../../api/profilesApis";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showLogMessage } from "../../utils/logs";
import LocationInput from "../../components/LocationInput";

function ProfileNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});

  const { mutateAsync: saveBasicInfoAPI, isPending: basicInfoAPILoading } =
    useProfileBasicInfo();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(FORM_ERRORS.invalidEmail).required(),
    location: Yup.object().required(),
    description: Yup.string().required(),
    coverMedia: Yup.mixed().required(),
    eco_score: Yup.number().required(),
  });

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
      };

      const response = await saveBasicInfoAPI({ ...details });

      setProfile(response);
      toast("Your profile is created successfully!", { type: "success" });
      navigate(`/user/profile`);
    } catch (err) {
      showLogMessage(`ERROR ~ ${JSON.stringify(err)}`);
    }
  };

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
                      name: profile?.name || "",
                      email: profile?.email || "",
                      location: profile?.location || null,
                      description: profile?.description || "",
                      coverMedia: profile?.coverMedia || null,
                      eco_score: profile?.eco_score || "",
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, setFieldValue, getFieldProps }) => {
                      // const locationField = getFieldProps("location");
                      // const { ref } = usePlacesWidget({
                      //   apiKey: "AIzaSyAG6-op098pGqZTP2qLJJY-GGSPPigrs-0",
                      //   onPlaceSelected: (place) => {
                      //     console.log("place", place);
                      //     setFieldValue("location", place);
                      //   },
                      // });

                      return (
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
                                name="location"
                                label="Location"
                                placeholder="Lorem Ipsum"
                              />

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
                              disabled={basicInfoAPILoading}
                            >
                              {basicInfoAPILoading
                                ? "Just a moment..."
                                : `Save`}
                            </button>
                          </div>
                        </Form>
                      );
                    }}
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

export default ProfileNew;
