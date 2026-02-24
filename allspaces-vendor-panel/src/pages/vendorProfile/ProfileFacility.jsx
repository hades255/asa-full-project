import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AddCircle, Edit2, Trash } from "iconsax-react";
import { FacilityForm } from "./FacilityForm";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { showToast } from "../../utils/logs";
import {
  PROFILE_API_ROUTES,
  useDeleteProfileFacility,
} from "../../api/profilesApis";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileFacility = () => {
  const { profile: vendorProfile } = useAuth();
  const profile = vendorProfile.profile;
  const [facilityModal, setFacilityModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteProfileFacilityAPI,
    isPending: deleteProfileFacilityLoading,
  } = useDeleteProfileFacility();

  const onDeleteConfirm = async () => {
    try {
      if (!profile) return;

      await deleteProfileFacilityAPI({
        profileId: profile.id,
        facilityId: selectedFacility.id,
      });

      showToast(`Facility is deleted`, "success");
      setSelectedFacility(null);
      setDeleteModal(false);

      await queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full overflow-y-auto">
      <div className="flex flex-wrap gap-3">
        {profile.facilities.map((facility) => (
          <div
            key={facility.id}
            className="gap-x-3 group relative flex items-center justify-between px-4 py-3 rounded-full bg-semantic-background-backgroundSecondary text-body1 font-normal text-semantic-content-contentPrimary transition-all duration-300 w-fit"
          >
            <span className="whitespace-nowrap">{facility.name}</span>

            {/* Icons (appear on hover) */}
            <div className="flex items-center gap-x-2 overflow-hidden max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[80px] group-hover:opacity-100">
              <button
                onClick={() => {
                  setSelectedFacility(facility);
                  setTimeout(() => {
                    setFacilityModal(true);
                  }, 500);
                }}
              >
                <Edit2 className="w-5 h-5 text-semantic-content-contentPrimary" />
              </button>
              <button
                onClick={() => {
                  if (profile.facilities.length === 1) {
                    showToast(`At least one facility is required`, "warning");
                    return;
                  }
                  setSelectedFacility(facility);
                  setTimeout(() => {
                    setDeleteModal(true);
                  }, 500);
                }}
              >
                <Trash className="w-5 h-5 text-semanticExtensions-content-contentNegative" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            setFacilityModal(true);
          }}
          className="gap-x-2 flex items-center justify-between px-4 py-3 rounded-full bg-semantic-background-backgroundInversePrimary text-body1 font-normal text-semantic-content-contentInversePrimary"
        >
          <AddCircle className="w-5 h-5" />
          <p>{`Add New Facility`}</p>
        </button>
      </div>

      <FacilityForm
        facility={selectedFacility}
        setFacility={setSelectedFacility}
        modalOpen={facilityModal}
        setModalOpen={setFacilityModal}
      />
      <ConfirmationModal
        title={`Delete Facility`}
        subtitle={`Are you sure to delete this facility?`}
        modalOpen={deleteModal}
        setModalOpen={setDeleteModal}
        loading={deleteProfileFacilityLoading}
        setState={() => {
          setSelectedFacility(null);
        }}
        onNoPress={() => {
          setDeleteModal(false);
          setSelectedFacility(null);
        }}
        onYesPress={onDeleteConfirm}
      />
    </div>
  );
};
