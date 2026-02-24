import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import DeleteButton from "../../partials/actions/DeleteButton";
import DateSelect from "../../components/DateSelect";
import FilterButton from "../../components/DropdownFilter";
import CustomersTable from "../../partials/customers/CustomersTable";
import PaginationClassic from "../../components/PaginationClassic";
import FintechCard05 from "../../partials/fintech/FintechCard05";
import AnalyticsCard02 from "../../partials/analytics/AnalyticsCard02";
import BookingOrderDetailsTable from "../../components/bookings/BookingOrderDetailsTable";
import BookingCustomerOverview from "../../components/bookings/BookingCustomerOverview";

import ProfileDisplay from "../../images/profile-display.svg";
import MediaSampleImage from "../../images/media-sample-image.png";
import LocationIcon from "../../images/location-icon.svg";
import WifiIcon from "../../images/wifi-icon.svg";
import EditIcon from "../../images/edit-icon.svg";
import LeftIcon from "../../images/left-icon.png";
import ShowIcon from "../../images/show-icon.png";
import AddIcon from "../../images/add-with-bg-icon.png";
import CloseCircleBlackIconIcon from "../../images/close-circle-black-icon.png";

import { Link } from "react-router-dom";
import ModalBasic from "../../components/ModalBasic";
import profilesApis, {
  PROFILE_API_ROUTES,
  useAddProfileFacility,
  useEditProfileFacility,
  useGetProfile,
  useToggleProfileStatus,
} from "../../api/profilesApis";
import * as Yup from "yup";

import { BACKEND_BASE_URL } from "../../utils/Constants";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { getImageFullPath, getImageNameFromPath } from "../../utils/Images";
import { capitalizeFirstLetter } from "../../utils/Utils";
import { showLogMessage } from "../../utils/logs";
import { useQueryClient } from "@tanstack/react-query";
import RatingStars from "../../components/RatingStars";
import RatingBar from "../../components/RatingBar";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [mediaCurrentPos, setMediaCurrentPos] = useState(0);

  const queryClient = useQueryClient();
  const facilityValidationSchema = Yup.object().shape({
    name: Yup.string().required("Facility name is required"),
  });

  const { data: profile, isPending } = useGetProfile();
  const {
    mutateAsync: toggleProfileStatusAPI,
    isPending: toggleProfileStatusAPILoading,
  } = useToggleProfileStatus();
  const {
    mutateAsync: addProfileFacilityAPI,
    isPending: addFacilityAPILoading,
  } = useAddProfileFacility();

  const {
    mutateAsync: editProfileFacilityAPI,
    isPending: editFacilityAPILoading,
  } = useEditProfileFacility();

  // useEffect(() => {
  //   const retrieveProfiles = async () => {
  //     try {
  //       const response = await profilesApis.fetchProfiles();
  //       console.log("Final response profiles index => ", response);

  //       if (response.status === 200) {
  //         setProfile(response.data[0] || {});
  //       }
  //     } catch (error) {
  //       console.log("error => ", error);
  //     }
  //   };

  //   retrieveProfiles();
  // }, []);

  // Handle profile facility form submission
  const handleProfileFacilitySubmit = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      if (selectedFacility) {
        let details = {
          profileId: vendorProfile.id,
          facilityId: selectedFacility.id,
          name: values.name.trim(),
        };
        await editProfileFacilityAPI(details);
      } else {
        await addProfileFacilityAPI({
          profileId: vendorProfile.id,
          name: values.name,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      resetForm();
      setFacilityModalOpen(false);
      toast(
        `Facility is ${selectedFacility ? "updated" : "added"} successfully!`,
        { type: "success" }
      );
      setSelectedFacility(null);
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const mediaCurrentPosHandler = (direction) => {
    if (!vendorProfile && vendorProfile.media.length <= 0) return;

    if (direction == "prev") {
      setMediaCurrentPos(
        mediaCurrentPos == 0
          ? vendorProfile.media.length - 1
          : mediaCurrentPos - 1
      );
    } else {
      setMediaCurrentPos(
        mediaCurrentPos == vendorProfile.media.length - 1
          ? 0
          : mediaCurrentPos + 1
      );
    }
  };

  if (isPending) return null;

  const { profile: vendorProfile } = profile;

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
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Profile
                </h1>
              </div>
            </div>

            {vendorProfile ? (
              <div className="w-full bg-white rounded-2xl p-5 divide-y divide-[#E8E8E8]">
                <div className="w-full grid grid-cols-12 gap-4 mb-4">
                  <div className="md:col-span-4 h-[300px]">
                    <img
                      src={getImageFullPath(vendorProfile.coverMedia)}
                      alt="Profile"
                      className="w-full h-full object-contain rounded-lg "
                    />
                  </div>

                  <div className="md:col-span-8 p-4">
                    <h2 className="flex items-center justify-between text-4xl font-bold mb-2">
                      {vendorProfile.name}
                      <div className="flex items-center justify-end gap-x-4">
                        <button
                          onClick={async () => {
                            await toggleProfileStatusAPI();
                            queryClient.invalidateQueries({
                              queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
                            });
                          }}
                          className="w-fit px-4 py-2 bg-black text-white text-center  rounded-full text-base font-medium"
                        >
                          {toggleProfileStatusAPILoading
                            ? `Just a moment...`
                            : vendorProfile.status == "INACTIVE"
                            ? `Publish`
                            : `Unpublish`}
                        </button>
                        <Link
                          to={`/user/edit-profile?profileId=${vendorProfile.id}`}
                          className="bg-black rounded-full p-3 w-11 h-11"
                        >
                          <img
                            src={EditIcon}
                            width="24"
                            height="24"
                            className=""
                          />
                        </Link>
                      </div>
                    </h2>
                    <span
                      className={`rounded-full ${
                        vendorProfile.status != "PUBLISHED"
                          ? "bg-[#F6BC2F] text-black"
                          : "bg-[#0E8345] text-white"
                      } text-base font-semibold shadow-sm transition duration-150 px-3 py-1 mb-4`}
                    >
                      {capitalizeFirstLetter(vendorProfile.status)}
                    </span>
                    <h3 className="flex items-center text-sm text-lightGray my-2">
                      <img src={LocationIcon} className="w-5 h-5 mr-3" />
                      {vendorProfile.address}
                    </h3>
                    <h2 className="text-xl text-black font-medium mb-2">
                      Description
                    </h2>
                    <p className="text-black text-base">
                      {vendorProfile.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="w-full flex justify-between items-center text-2xl font-medium text-black mb-2 mt-4">
                    Free Facilities
                    <img
                      src={AddIcon}
                      width="32"
                      height="32"
                      aria-controls="facility-modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFacility(null);
                        setTimeout(() => {
                          setFacilityModalOpen(true);
                        }, 500);
                      }}
                    />
                  </h2>
                  <div className="flex flex-wrap gap-8">
                    {vendorProfile.facilities?.map((facility, index) => (
                      <button
                        key={index}
                        className="bg-extraLightLight rounded-full flex px-4 py-2 items-center justify-center text-base text-black cursor-pointer transition-transform duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedFacility(facility);
                          setTimeout(() => {
                            setFacilityModalOpen(true);
                          }, 500);
                        }}
                      >
                        <span>{facility.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="mt-4">
                  <h2 className="w-full flex justify-between items-center text-2xl font-medium text-black mb-2 mt-4">
                    Services
                    <Link
                      to={`/user/edit-service?profile_id=${vendorProfile.id}`}
                      className=""
                    >
                      <img src={AddIcon} width="32" height="32" className="" />
                    </Link>
                  </h2>
                  {vendorProfile.services?.map((vendorService, index) => (
                    <Link
                      key={index}
                      to={`/user/edit-service?profile_id=${vendorProfile.id}&service_id=${vendorService.id}`}
                      className="w-full flex items-center mb-4 border-extraLightLight px-4 py-2 rounded-md border cursor-pointer"
                    >
                      <div className="w-16 h-16 shrink-0 mr-3">
                        {vendorService.media ? (
                          <img
                            src={vendorService.media}
                            className="rounded-full w-16 h-16 object-cover"
                            alt="Profile"
                          />
                        ) : (
                          <img
                            src={MediaSampleImage}
                            className="rounded-full w-16 h-16 object-cover"
                            alt="Profile"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-black">
                          {vendorService.name}
                        </div>
                        <div className="text-base text-black">
                          {vendorService.description}
                        </div>
                        <div className="text-base text-black">
                          {`$ ${vendorService.minSpend}`}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Media */}
                <div className="mt-4">
                  <h2 className="w-full flex justify-between items-center text-2xl font-medium text-black mb-2 mt-4">
                    Media
                    <Link
                      to={`/user/edit-media?profile_id=${vendorProfile.id}`}
                    >
                      <img src={AddIcon} width="32" height="32" className="" />
                    </Link>
                  </h2>
                  <div className="grid grid-cols-12 gap-6 my-6">
                    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-6">
                      {vendorProfile.media?.map((media, index) => (
                        <div
                          key={media.id}
                          className="w-full flex items-center mb-4"
                        >
                          <div className="w-16 h-16 shrink-0 mr-3 overflow-hidden rounded-full">
                            <img
                              src={media.url}
                              className="w-full h-full object-cover"
                              alt="Profile"
                            />
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <div>
                              <p className="text-base font-semibold text-black">
                                {getImageNameFromPath(media.url)}
                              </p>
                              {/* <p className="text-base text-black">500KB</p> */}
                            </div>
                            {/* <img src={ShowIcon} width="32" height="32" /> */}
                          </div>
                        </div>
                      ))}
                    </div>
                    {vendorProfile?.media && vendorProfile.media.length > 0 && (
                      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6">
                        <img
                          src={vendorProfile.media[mediaCurrentPos].url}
                          className="w-full h-[250px] rounded-lg object-cover"
                        />
                        <div className="flex justify-between text-sm text-black mt-2 gap-2">
                          <img
                            src={LeftIcon}
                            width="34px"
                            height="34px"
                            className="w-[34px] h-[34px] pointer-cursor"
                            onClick={() => mediaCurrentPosHandler("prev")}
                          />
                          {getImageNameFromPath(
                            vendorProfile.media[mediaCurrentPos].url
                          )}
                          <img
                            src={LeftIcon}
                            width="34px"
                            height="34px"
                            className="w-[34px] h-[34px] rotate-180"
                            onClick={() => mediaCurrentPosHandler("next")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews */}
                <div className="mt-4">
                  <h2 className="w-full flex justify-between items-center text-2xl font-medium text-black mb-2 mt-4">
                    Reviews
                  </h2>
                  <div className="grid grid-cols-12 gap-6 my-6">
                    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-6">
                      <RatingStars
                        rating={vendorProfile.averageRating}
                        total={vendorProfile.totalReviews}
                      />

                      <div className="mt-4">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <RatingBar
                            key={star}
                            star={star}
                            count={
                              star === 5
                                ? vendorProfile.rating.fiveStarCount
                                : star === 4
                                ? vendorProfile.rating.fourStarCount
                                : star === 3
                                ? vendorProfile.rating.threeStarCount
                                : star === 2
                                ? vendorProfile.rating.twoStarCount
                                : vendorProfile.rating.oneStarCount
                            }
                            total={vendorProfile.totalReviews}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-screen flex justify-center items-center bg-white rounded-2xl p-5 divide-y divide-[#E8E8E8]">
                <div className="grid">
                  <span className="text-xl font-medium">
                    Please setup your profile to get started
                  </span>
                  <Link
                    to="/user/new-profile"
                    className="btn rounded-full bg-black text-white shadow-sm transition duration-150 px-14 py-4 mt-4"
                  >
                    Setup Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Start */}
          <ModalBasic
            id="facility-modal"
            modalOpen={facilityModalOpen}
            setModalOpen={setFacilityModalOpen}
            title={selectedFacility ? "Edit Facility" : "Add Facility"}
          >
            {/* Formik Form */}
            <Formik
              initialValues={{
                name: selectedFacility?.name || "",
              }}
              enableReinitialize={true}
              validationSchema={facilityValidationSchema}
              onSubmit={handleProfileFacilitySubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="px-5 py-4">
                    <div className="space-y-3">
                      <div>
                        <label
                          className="block text-black text-base font-medium mb-2 pl-4"
                          htmlFor="name"
                        >
                          Name
                        </label>
                        <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Free Wifi"
                            className="flex-1 w-full bg-transparent text-base font-normal placeholder-lightGray text-black px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1 pl-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-x-4">
                      {selectedFacility && (
                        <button
                          disabled
                          className="w-full btn rounded-full bg-red-400 text-white shadow-sm transition duration-150 px-12 py-4"
                        >
                          {`Delete`}
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={
                          editFacilityAPILoading || addFacilityAPILoading
                        }
                        className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4"
                      >
                        {editFacilityAPILoading || addFacilityAPILoading
                          ? "Just a moment..."
                          : "Save"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBasic>
          {/* End */}
        </main>
      </div>
    </div>
  );
}

export default Profile;
