import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import MediaSampleImage from "../../images/media-sample-image.png";
import CloseCircleBlackIconIcon from "../../images/close-circle-black-icon.png";

import UploadIcon from "../../images/upload-file-icon.png";

import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import profilesApis, {
  PROFILE_API_ROUTES,
  useAddProfileMedia,
  useGetProfile,
} from "../../api/profilesApis";
import { BACKEND_BASE_URL } from "../../utils/Constants";
import { getImageFullPath, getImageNameFromPath } from "../../utils/Images";
import { useQueryClient } from "@tanstack/react-query";
import { showLogMessage } from "../../utils/logs";

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
const maxFileSize = 10 * 1024 * 1024; // 10 MB
const maxFiles = 5;
function MediaEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [medias, setMedias] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const [searchParams] = useSearchParams();
  // const { data: profile } = useGetProfile();
  const queryClient = useQueryClient();
  const {
    mutateAsync: addProfileMediaAPI,
    isPending: addProfileMediaAPILoading,
  } = useAddProfileMedia();
  const navigate = useNavigate();

  useEffect(() => {
    setProfileId(searchParams.get("profile_id") || "");
  }, []);

  const initialValues = {
    media: [],
  };

  const validationSchema = Yup.object().shape({
    media: Yup.mixed()
      .test(
        "fileCount",
        `You can upload up to ${maxFiles} files`,
        (files) => files.length <= maxFiles
      )
      .test("fileSize", "Each file must be less than 10MB", (files) =>
        files.every((file) => file.size <= maxFileSize)
      )
      .test("fileType", "Only JPG, PNG, MP4, and SVG are allowed", (files) =>
        files.every((file) => allowedFileTypes.includes(file.type))
      ),
  });

  // const fetchProfileByID = async (profile_id) => {
  //   try {
  //     const response = await profilesApis.retrieveProfile(profile_id);

  //     console.log("Profile fetched against ID => ", response);

  //     if (response.status === 200) {
  //       setProfile(response.data);
  //       setMedias(response.data?.medias || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //     toast.error("Profile missed!");
  //   }
  // };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { media } = values;

      await addProfileMediaAPI({ profileId: profileId, medias: media });

      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
      toast.success("Media Files are uploaded successfully!");
      navigate("/user/profile");
      // console.log("media files while submitting form => ", media);

      // const response = await profilesApis.addProfileMedias(profileId, media);

      // if (response.status === 200) {
      //   setMedias(response.data.media);
      //   toast.success("Medias added successfully!");
      //   navigate("/user/profile");
      // }
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const validFiles = files.filter(
      (file) => file.size <= maxFileSize && allowedFileTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert("Some files were rejected due to size or format.");
    }

    setFieldValue("media", validFiles);

    // Preview selected files
    const previews = validFiles.map((file) =>
      file.type.startsWith("image") ? URL.createObjectURL(file) : null
    );

    console.log("previews => ", previews);

    setFilePreviews(previews);
  };

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
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
                  Edit Media
                </h1>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full grid grid-cols-12 gap-4 mb-4 bg-white rounded-2xl p-5">
                <div className="flex flex-col col-span-full xl:col-span-12">
                  <div className="flex flex-col h-full">
                    <div className="w-full grow px-5 pt-3 pb-1">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, setFieldValue }) => (
                          <Form
                            id="profile-media-only-form"
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="w-full col-span-full gap-4">
                              <h3 className="block text-black text-base font-medium mb-2">
                                Media Upload
                              </h3>
                              <p className="text-lightGray text-xs font-normal my-2">
                                Add your documents here, and you can upload up
                                to 5 files max
                              </p>

                              <div className="grid place-items-center border-black border-3 border-dotted rounded p-6">
                                <input
                                  type="file"
                                  multiple
                                  accept=".jpg, .png, .jpeg"
                                  onChange={(event) =>
                                    handleFileChange(event, setFieldValue)
                                  }
                                  className="hidden"
                                  id="fileInput"
                                />
                                <label
                                  htmlFor="fileInput"
                                  className="flex flex-col items-center cursor-pointer"
                                >
                                  <img
                                    src={UploadIcon}
                                    width="36"
                                    height="24"
                                    alt="Upload Icon"
                                  />
                                  <p className="text-sm text-black my-2">
                                    Drag your file(s) or{" "}
                                    <span className="font-bold ml-1">
                                      browse
                                    </span>
                                  </p>
                                  <p className="text-sm text-[#0E8345]">
                                    Max 10 MB files are allowed
                                  </p>
                                </label>
                                {/* Preview Selected Files */}
                                {filePreviews.length > 0 && (
                                  <div className="grid grid-cols-5 gap-4 mt-4">
                                    {filePreviews.map((src, index) =>
                                      src ? (
                                        <img
                                          key={index}
                                          src={src}
                                          alt="Preview"
                                          className="w-20 h-20 object-cover rounded"
                                        />
                                      ) : null
                                    )}
                                  </div>
                                )}
                              </div>

                              <p className="text-lightGray text-xs font-normal mt-2">
                                Only support .jpg, .png, .jpeg
                              </p>

                              <ErrorMessage
                                name="media"
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="w-full col-span-full">
                          <hr className="my-4 border-t border-slate-200 dark:border-slate-700" />
                          {medias?.length > 0 && (
                            <>
                              {medias.map((media, index) => (
                                <div key={index} className="">
                                  <div className="w-full flex items-center mb-4">
                                    <div className="w-16 h-16 shrink-0 mr-3">
                                      <img
                                        src={getImageFullPath(media.filePath)}
                                        className="rounded-full w-16 h-16 object-cover"
                                        alt="Profile"
                                      />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                      <div>
                                        <p className="text-base font-semibold text-black">
                                          {getImageNameFromPath(media.filePath)}
                                        </p>
                                        {/* <p className="text-base text-black">500KB</p> */}
                                      </div>
                                      <img
                                        src={CloseCircleBlackIconIcon}
                                        width="32"
                                        height="32"
                                      />
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
                              ))}
                            </>
                          )}

                          {/* Save Changes Button */}
                          <div className="grid bg-white rounded-2xl p-5">
                            <button
                              type="submit"
                              form="profile-media-only-form"
                              disabled={addProfileMediaAPILoading}
                              className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4"
                            >
                              {addProfileMediaAPILoading ? "Just a moment..." : "Save"}
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

export default MediaEdit;
