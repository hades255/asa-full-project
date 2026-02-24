import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Edit2, Trash } from "iconsax-react";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { EmptyMessage } from "../../components/EmptyMessage";
import { AppButton } from "../../components";
import { MediaForm } from "./MediaForm";
import { showToast } from "../../utils/logs";
import {
  PROFILE_API_ROUTES,
  useDeleteProfileMedia,
} from "../../api/profilesApis";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileMedia = () => {
  const { profile: vendorProfile } = useAuth();
  const profile = vendorProfile.profile;
  const [deleteModal, setDeleteModal] = useState(false);
  const [mediaForm, setMediaForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const queryClient = useQueryClient();
  const { mutateAsync: deleteMediaAPI, isPending: deleteMediaLoading } =
    useDeleteProfileMedia();

  const onDeleteConfirm = async () => {
    try {
      if (!profile) return;

      await deleteMediaAPI({
        profileId: profile.id,
        mediaId: selectedMedia.id,
      });

      await queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      showToast(`Media is deleted`, "success");
      setSelectedMedia(null);
      setDeleteModal(false);
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <PhotoProvider>
      <div className="flex flex-1 flex-col w-full h-full overflow-y-auto">
        <div className="flex items-center justify-end mb-4">
          <AppButton
            onClick={() => {
              setSelectedMedia(null);
              setTimeout(() => {
                setMediaForm(true);
              }, 500);
            }}
            width={`w-full lg:w-[200px]`}
            title={`Add New Media`}
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full h-full">
          {profile?.media?.length ? (
            profile.media.map((media) => {
              return (
                <div
                  key={media.id}
                  className="relative group border border-dashed bg-semantic-background-backgroundSecondary rounded-2xl w-full h-56 lg:w-64 lg:h-64 items-center justify-center cursor-pointer transition-all duration-300 shadow-none hover:shadow-lg"
                >
                  <PhotoView src={media.url}>
                    <img
                      src={media.url}
                      alt="Media File"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </PhotoView>

                  {/* Hover icons */}
                  <div className="absolute top-3 right-3 flex items-center gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setSelectedMedia(media);
                        setTimeout(() => {
                          setMediaForm(true);
                        }, 500);
                      }}
                      className="p-2 bg-semantic-background-backgroundTertionary hover:bg-semantic-content-contentInversePrimary rounded-full shadow-md transition"
                    >
                      <Edit2 className="w-5 h-5 text-semantic-content-contentPrimary" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMedia(media);
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
            })
          ) : (
            <EmptyMessage message={`You do not have any media yet!`} />
          )}
        </div>
        <ConfirmationModal
          title={`Delete Media`}
          subtitle={`Are you sure to delete this media?`}
          modalOpen={deleteModal}
          loading={deleteMediaLoading}
          setModalOpen={setDeleteModal}
          onNoPress={() => {
            setDeleteModal(false);
            setSelectedMedia(null);
          }}
          onYesPress={onDeleteConfirm}
          setState={() => {
            setSelectedMedia(null);
          }}
        />
        <MediaForm
          modalOpen={mediaForm}
          setModalOpen={setMediaForm}
          media={selectedMedia}
          setMedia={setSelectedMedia}
        />
      </div>
    </PhotoProvider>
  );
};
