import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AppButton } from "../../components";
import { ServiceForm } from "./ServiceForm";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Edit2, Trash } from "iconsax-react";
import {
  PROFILE_API_ROUTES,
  useDeleteProfileService,
} from "../../api/profilesApis";
import { showToast } from "../../utils/logs";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileServices = () => {
  const { profile: vendorProfile } = useAuth();
  const { profile } = vendorProfile;
  const [serviceModal, setServiceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteServiceAPI, isPending: deleteLoading } =
    useDeleteProfileService();

  const onDeleteConfirm = async () => {
    try {
      if (!profile) return;

      await deleteServiceAPI({ serviceId: selectedService.id });

      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      showToast(`Service is deleted`, "success");
      setDeleteModal(false);
      setSelectedService(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full overflow-y-auto">
      <div className="flex items-center justify-end mb-4">
        <AppButton
          onClick={() => {
            setSelectedService(null);
            setTimeout(() => {
              setServiceModal((prev) => !prev);
            }, 500);
          }}
          width={`w-full lg:w-[200px]`}
          title={`Add New Service`}
        />
      </div>
      <div className="flex flex-col w-full gap-y-4">
        {profile.services.map((service, index) => {
          return (
            <div
              key={index}
              className="group relative flex items-center gap-x-3 bg-semantic-background-backgroundSecondary rounded-2xl p-4 transition-all shadow-none hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-full">
                <img
                  src={service.media}
                  alt="Service Image"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-y-1 flex-1 w-full">
                <p className="font-medium text-heading4 text-semantic-content-contentPrimary">
                  {service.name}
                </p>
                <p className="font-medium text-heading4 text-semanticExtensions-content-contentAccent">{`${service.minSpend} min spend`}</p>
                <p className="font-normal text-body1 text-semantic-content-contentSecondary">
                  {service.description}
                </p>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setTimeout(() => {
                      setServiceModal(true);
                    }, 500);
                  }}
                  className="p-2 bg-semantic-background-backgroundTertionary hover:bg-semantic-content-contentInversePrimary rounded-full shadow-md transition"
                >
                  <Edit2 className="w-5 h-5 text-semantic-content-contentPrimary" />
                </button>
                <button
                  onClick={() => {
                    if (profile.services.length == 1) {
                      showToast(`At least one service is required`, "warning");
                      return;
                    }
                    setSelectedService(service);
                    setTimeout(() => {
                      setDeleteModal(true);
                    }, 500);
                  }}
                  className="p-2 bg-semantic-background-backgroundTertionary hover:bg-semantic-content-contentInversePrimary rounded-full shadow-md transition"
                >
                  <Trash className="w-5 h-5 text-semanticExtensions-content-contentNegative" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ServiceForm
        modalOpen={serviceModal}
        setModalOpen={setServiceModal}
        service={selectedService}
        setService={setSelectedService}
      />

      <ConfirmationModal
        title={`Delete Service`}
        subtitle={`Are you sure to delete this service?`}
        loading={deleteLoading}
        modalOpen={deleteModal}
        setModalOpen={setDeleteModal}
        onNoPress={() => {
          setSelectedService(null);
          setDeleteModal((prev) => !prev);
        }}
        onYesPress={onDeleteConfirm}
        setState={() => {
          setSelectedService(null);
        }}
      />
    </div>
  );
};
