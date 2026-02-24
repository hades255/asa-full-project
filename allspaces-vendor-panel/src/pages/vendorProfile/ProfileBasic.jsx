import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as Yup from "yup";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showToast } from "../../utils/logs";
import { Form, Formik } from "formik";
import { ImagePicker } from "../../components/ImagePicker";
import { AppButton, AppInput } from "../../components";
import LocationInput from "../../components/LocationInput";
import { Sms, User } from "iconsax-react";
import { Loader } from "../../components/Loader";
import {
  PROFILE_API_ROUTES,
  useEditProfileBasicInfo,
} from "../../api/profilesApis";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileBasic = () => {
  const { profile } = useAuth();
  const [location, setLocation] = useState("");
  const [locationErr, setLocationErr] = useState("");
  const [imgPickerErr, setImgPickerErr] = useState("");
  const [place, setPlace] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { mutateAsync: editBasicInfoAPI, isPending: editBasicInfoAPILoading } =
    useEditProfileBasicInfo();

  const queryClient = useQueryClient();

  let vendorProfile = profile?.profile;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_ERRORS.invalidName),
    email: Yup.string().email(FORM_ERRORS.invalidEmail).required(),
    description: Yup.string().required(FORM_ERRORS.requireDescription),
  });

  useEffect(() => {
    if (vendorProfile) {
      setPreview(vendorProfile.coverMedia);
      setLocation(vendorProfile.address);
    }
  }, [vendorProfile]);

  if (!vendorProfile) return <Loader color={"#000"} />;

  const handleSubmit = async (values, {}) => {
    try {
      if (!image && !preview) {
        setImgPickerErr("Image is required");
        return;
      }

      if (!place && !location) {
        setLocationErr(`Location is required`);
        return;
      }

      setImgPickerErr("");
      setLocationErr("");

      let details = {
        name: values.name,
        description: values.description,
        email: values.email,
        location: {
          lat: place
            ? place.geometry.location.lat()
            : vendorProfile.location.lat,
          lng: place
            ? place.geometry.location.lng()
            : vendorProfile.location.lng,
        },
        address: place ? place.formatted_address : vendorProfile.address,
        coverMedia: image ? image : preview,
        profileId: vendorProfile.id,
      };

      await editBasicInfoAPI(details);

      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
      showToast(`Profile Details are updated`, "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full overflow-y-auto">
      <Formik
        enableReinitialize
        initialValues={{
          name: vendorProfile?.name || "",
          email: vendorProfile?.email || "",
          description: vendorProfile?.description || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex w-full flex-col items-center gap-y-9 lg:max-w-[600px] max-w-[400px]">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <ImagePicker
              alreadyPreview={preview}
              error={imgPickerErr}
              onChange={setImage}
            />
            <AppInput
              id={"name"}
              name={"name"}
              label={`Name`}
              placeholder={`e.g. Hilton Hotel`}
              icon={<User />}
            />
            <AppInput
              id={"email"}
              name={"email"}
              label={`Email`}
              placeholder={`e.g. support@hilton.com`}
              icon={<Sms />}
            />
            <LocationInput
              label={`Location`}
              value={location}
              onChange={setLocation}
              place={place}
              setPlace={setPlace}
              placeholder={`Location`}
              error={locationErr}
            />
            <AppInput
              type={"textarea"}
              id={"description"}
              name={"description"}
              label={`Description`}
              placeholder={`Write brief description here...`}
            />
          </div>
          <AppButton
            type={"submit"}
            title={`Update`}
            loading={editBasicInfoAPILoading}
          />
        </Form>
      </Formik>
    </div>
  );
};
