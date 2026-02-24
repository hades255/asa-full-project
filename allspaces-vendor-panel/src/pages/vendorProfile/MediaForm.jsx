import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../utils/logs";
import { Modal } from "../../components/Modal";
import { AppButton } from "../../components";
import { ImagePicker } from "../../components/ImagePicker";
import {
  PROFILE_API_ROUTES,
  useAddProfileMedia,
  useEditProfileMedia,
} from "../../api/profilesApis";

export const MediaForm = ({ media, setMedia, modalOpen, setModalOpen }) => {
  const { profile: vendorProfile } = useAuth();
  const { profile } = vendorProfile;

  const queryClient = useQueryClient();

  const [image, setImage] = useState(null);
  const [imgPickerErr, setImgPickerErr] = useState("");
  const [preview, setPreview] = useState(null);

  const { mutateAsync: addMediaAPI, isPending: addMediaLoading } =
    useAddProfileMedia();

  const { mutateAsync: editMediaAPI, isPending: editMediaLoading } =
    useEditProfileMedia();

  const handleSubmit = async () => {
    try {
      if (!profile) return;

      if (!image) {
        setImgPickerErr(`Image is required`);
        return;
      }

      setImgPickerErr("");

      if (!media) await addMediaAPI({ profileId: profile.id, medias: [image] });
      else
        await editMediaAPI({
          profileId: profile.id,
          mediaId: media.id,
          media: image,
        });

      await queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
      showToast(`Media is ${media ? "edited" : "added"}`, "success");
      setModalOpen(false);
      setMedia(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  useEffect(() => {
    if (media) {
      setPreview(media.url);
    }
  }, [media]);

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen((prev) => !prev);
        setMedia(null);
        setImgPickerErr("");
        setPreview(null);
      }}
      title={`${media ? `Edit` : `Add`} Media`}
    >
      <div className="flex flex-col gap-y-4 w-full items-center">
        <ImagePicker
          error={imgPickerErr}
          onChange={setImage}
          alreadyPreview={preview}
        />
        <AppButton
          onClick={handleSubmit}
          title={`Continue`}
          loading={addMediaLoading || editMediaLoading}
        />
      </div>
    </Modal>
  );
};
