import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ExportIcon from "../../images/export-icon.svg";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { getImageFullPath, getImageNameFromPath } from "../../utils/Images";

import CloseCircleBlackIconIcon from "../../images/close-circle-black-icon.png";
import UploadIcon from "../../images/upload-file-icon.png";
import profilesApis, {
  PROFILE_API_ROUTES,
  useAddProfileService,
  useEditProfileService,
  useGetProfileCategories,
  useGetProfileSubCategories,
  useGetServiceById,
} from "../../api/profilesApis";
import { useQueryClient } from "@tanstack/react-query";
import { showLogMessage } from "../../utils/logs";

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "video/mp4",
];
const maxFileSize = 10 * 1024 * 1024; // 10 MB

function ServiceEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [profileId, setProfileId] = useState({});
  const [serviceId, setServiceId] = useState({});
  const [profile, setProfile] = useState({});
  const [service, setService] = useState({});
  const [unitSelected, setUnitSelected] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [maxFiles, setMaxFiles] = useState(5);

  const [parentId, setParentId] = useState("");
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();
  const { data: categories } = useGetProfileCategories();
  const { mutateAsync: getProfileSubcategories, data: subCategories } =
    useGetProfileSubCategories();
  const { mutateAsync: editServiceAPI, isPending: editServiceAPILoading } =
    useEditProfileService();
  const {
    mutateAsync: addProfileServiceAPI,
    isPending: addProfileServiceAPILoading,
  } = useAddProfileService();
  const {
    mutateAsync: getServiceById,
    data: serviceDetails,
    isPending: serviceLoading,
  } = useGetServiceById();
  const navigate = useNavigate();

  useEffect(() => {
    const prof_id = searchParams.get("profile_id") || "";
    const serv_id = searchParams.get("service_id") || "";
    setProfileId(prof_id);
    setServiceId(serv_id);
    if (prof_id && serv_id) {
      getServiceById(serv_id);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    minSpend: Yup.number().typeError("Min Spend must be a number").required(),
    description: Yup.string().required(),
    categoryId: Yup.string().required(),
    subcategoryId: Yup.string().required(),
    coverMedia: Yup.mixed().required(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (serviceId) {
        let details = {
          serviceId: serviceId,
          name: values.name,
          description: values.description,
          categoryId: values.subcategoryId,
          minSpend: values.minSpend,
          media: typeof values.coverMedia == "string" ? "" : values.coverMedia,
        };
        await editServiceAPI(details);
        // console.log("updating service");
        // const response = await profilesApis.updateProfileService(
        //   id, profileId, name, rate, minSpend, unitMeasure, description, media
        // );
        // if (response.status === 200) {
        //   setService(response.data.service);
        //   toast.success("Service updated successfully!");
        //   navigate(`/user/profile`);
        //   // resetForm();
        // }
      } else {
        await addProfileServiceAPI({
          name: values.name,
          description: values.description,
          categoryId: values.subcategoryId,
          minSpend: values.minSpend,
          media: values.coverMedia,
        });

        // if (response.status === 200) {
        //   setService(response.data.service);
        //   toast.success("Service added successfully!");
        //   navigate(`/user/profile`);
        //   // resetForm();
        // }
      }
      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      toast.success(
        `Service is ${serviceId ? `updated` : `added`} successfully!`
      );
      navigate(`/user/profile`);
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  useEffect(() => {
    if (serviceDetails) getProfileSubcategories(serviceDetails.categoryId);
  }, [serviceDetails]);

  if (!categories || (serviceId && !serviceDetails && !subCategories)) return;

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
                  {serviceId ? `Edit Service` : `Add Service`}
                </h1>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full grid grid-cols-12 gap-4 mb-4 bg-white rounded-2xl p-5">
                <div className="flex flex-col col-span-full xl:col-span-12">
                  <div className="flex flex-col h-full">
                    <div className="px-5 py-3 border-b border-slate-100">
                      <div className="flex items-center mb-4">
                        <h2 className="text-base font-semibold text-black">
                          Service
                        </h2>
                      </div>
                    </div>

                    <div className="w-full grow px-5 pt-3 pb-1">
                      <Formik
                        enableReinitialize
                        initialValues={{
                          id: serviceDetails?.id || "",
                          name: serviceDetails?.name || "",
                          minSpend: serviceDetails?.minSpend || "",
                          description: serviceDetails?.description || "",
                          categoryId: serviceDetails?.categoryId || "",
                          subcategoryId: serviceDetails?.subCategoryId || "",
                          coverMedia: serviceDetails?.media || "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, setFieldValue }) => (
                          <Form
                            id="service-info-form"
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div>
                              <label
                                className="block text-black text-base font-medium mb-2 pl-4"
                                htmlFor="name"
                              >
                                Name
                              </label>
                              <div className="h-14 flex items-center bg-extraLightLight rounded-full px-4 py-2">
                                <Field
                                  name="name"
                                  type="text"
                                  placeholder="Service Name"
                                  className="flex-1 w-full bg-transparent text-base font-normal placeholder-lightGray text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                />
                              </div>
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-sm pl-4 mt-1"
                              />
                            </div>

                            {/* <div>
                              <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="rate">Rate</label>
                              <div className="h-14 flex items-center bg-extraLightLight rounded-full px-4 py-2">
                                <Field
                                  name="rate"
                                  type="text"
                                  placeholder="245"
                                  className="flex-1 w-full bg-transparent text-base font-normal placeholder-lightGray text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                />
                              </div>
                              <ErrorMessage name="rate" component="div" className="text-red-500 text-sm pl-4 mt-1" />
                            </div> */}

                            <div>
                              <label
                                className="block text-black text-base font-medium mb-2 pl-4"
                                htmlFor="minSpend"
                              >
                                Min Spend
                              </label>
                              <div className="h-14 flex items-center bg-extraLightLight rounded-full px-4 py-2">
                                <Field
                                  name="minSpend"
                                  type="text"
                                  placeholder="$20"
                                  className="flex-1 w-full bg-transparent text-base font-normal placeholder-lightGray text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                />
                              </div>
                              <ErrorMessage
                                name="minSpend"
                                component="div"
                                className="text-red-500 text-sm pl-4 mt-1"
                              />
                            </div>

                            {/* <div>
                              <label
                                htmlFor="unitMeasure"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Unit of Measure
                              </label>
                              <Field
                                name="unitMeasure"
                                as="select"
                                className="h-14 flex items-center bg-extraLightLight rounded-full w-full text-base font-normal text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                              >
                                {measures.map((measure) => (
                                  <option key={measure.period} value={measure.value}>
                                    {measure.period}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="unitMeasure" component="div" className="text-red-500 text-sm pl-4 mt-1" />
                            </div> */}

                            <div className="w-full col-span-full">
                              <label className="block text-black text-base font-medium mb-2 pl-4">
                                Description
                              </label>
                              <div className="flex items-center bg-extraLightLight rounded-2xl px-4 py-2">
                                <Field
                                  as="textarea"
                                  name="description"
                                  rows="5"
                                  placeholder="Lorem Ipsum..."
                                  className="flex-1 w-full bg-transparent text-base font-normal placeholder-lightGray text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                                />
                              </div>
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="text-red-500 text-sm pl-4 mt-1"
                              />
                            </div>

                            <div>
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
                                {categories?.map((category) => {
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
                              <ErrorMessage
                                name="categoryId"
                                component="div"
                                className="text-red-500 text-sm pl-4 mt-1"
                              />
                            </div>

                            {/* Sub Category */}
                            {subCategories && subCategories.length ? (
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
                                <ErrorMessage
                                  name="subcategoryId"
                                  component="div"
                                  className="text-red-500 text-sm pl-4 mt-1"
                                />
                              </div>
                            ) : null}

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
                              <ErrorMessage
                                name="coverMedia"
                                component="div"
                                className="text-red-500 text-sm pl-4 mt-1"
                              />
                            </div>

                            {/* <div className="w-full col-span-full gap-4">
                              <h3 className="block text-black text-base font-medium mb-2">Media Upload</h3>
                              <p className="text-lightGray text-xs font-normal my-2">Add your documents here, and you can upload only 1 file</p>

                              <div className="grid place-items-center border-black border-3 border-dotted rounded p-6">
                                <input
                                  type="file"
                                  accept=".jpg, .png, .mp4, .svg"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files?.[0];

                                    if (file) {
                                      const previewUrl = URL.createObjectURL(file);
                                      setFilePreview(previewUrl);
                                      setFieldValue("media", file);
                                    }
                                  }}
                                  className="hidden"
                                  id="fileInput"
                                />
                                <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer">
                                  <img src={UploadIcon} width="36" height="24" alt="Upload Icon" />
                                  <p className="text-sm text-black my-2">
                                    Drag your file or <span className="font-bold ml-1">browse</span>
                                  </p>
                                  <p className="text-sm text-[#0E8345]">Max 10 MB files are allowed</p>
                                </label>
                                {filePreview && (
                                  <div className="flex items-center mt-4">
                                    <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                                  </div>
                                )}
                              </div>

                              <p className="text-lightGray text-xs font-normal mt-2">Only support .jpg, .png, .mp4, and .svg files</p>

                              <ErrorMessage name="media" component="div" className="text-red-500 text-sm" />
                            </div> */}
                          </Form>
                        )}
                      </Formik>
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <hr className="my-4 border-t border-slate-200 dark:border-slate-700" /> */}

                        <div className="w-full col-span-full">
                          <hr className="my-4 border-t border-slate-200 dark:border-slate-700" />

                          {service.media && (
                            <div>
                              <div className="w-full flex items-center mb-4">
                                <div className="w-16 h-16 shrink-0 mr-3">
                                  <img
                                    src={getImageFullPath(
                                      service.media.filePath
                                    )}
                                    className="rounded-full w-16 h-16 object-cover"
                                    alt="Profile"
                                  />
                                </div>
                                <div className="w-full flex justify-between items-center">
                                  <div>
                                    <p className="text-base font-semibold text-black">
                                      {getImageNameFromPath(
                                        service.media.filePath
                                      )}
                                    </p>
                                    {/* <p className="text-base text-black">500KB</p> */}
                                  </div>
                                  {/* <img src={CloseCircleBlackIconIcon} width="32" height="32" /> */}
                                </div>
                              </div>
                              {/* <div className="relative flex items-center w-full gap-2">
                                <div className="w-full bg-[#E8E8E8] rounded-full h-2.5">
                                  <div className="bg-[#0E8345] h-2.5 rounded-full w-3/5"></div>
                                </div>
                                <span className='text-xs mr-2 text-lightGray'>60%</span>
                              </div> */}
                              <hr className="my-4 border-t border-slate-200 dark:border-slate-700" />
                            </div>
                          )}

                          {/* Save Changes Button */}
                          <div className="flex items-center bg-white rounded-2xl p-5 gap-x-8">
                            {serviceId && (
                              <button
                                disabled
                                className="w-full btn rounded-full bg-red-500 text-white shadow-sm transition duration-150 px-12 py-4"
                              >
                                {`Delete`}
                              </button>
                            )}
                            <button
                              type="submit"
                              form="service-info-form"
                              // disabled={isSubmitting}
                              disabled={
                                addProfileServiceAPILoading |
                                editServiceAPILoading
                              }
                              className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4"
                            >
                              {addProfileServiceAPILoading ||
                              editServiceAPILoading
                                ? "Just a moment..."
                                : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ServiceEdit;
