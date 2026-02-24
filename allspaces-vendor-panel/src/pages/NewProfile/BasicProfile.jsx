import { useState } from "react";
import * as Yup from "yup";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showLogMessage, showToast } from "../../utils/logs";
import { Form, Formik } from "formik";
import { AppButton, AppInput } from "../../components";
import { Sms, User } from "iconsax-react";
import { ImagePicker } from "../../components/ImagePicker";
import LocationInput from "../../components/LocationInput";
import {
  PROFILE_API_ROUTES,
  useProfileBasicInfo,
} from "../../api/profilesApis";
import { saveInSecureLS, SECURE_LS_TOKENS } from "../../utils/secureLs";
import { useQueryClient } from "@tanstack/react-query";

export const BasicProfile = ({ setStep }) => {
  const [location, setLocation] = useState("");
  const [locationErr, setLocationErr] = useState("");
  const [imgPickerErr, setImgPickerErr] = useState("");
  const [place, setPlace] = useState(null);
  const [image, setImage] = useState(null);

  const { mutateAsync: createBasicProfieAPI, isPending } =
    useProfileBasicInfo();

  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(FORM_ERRORS.invalidEmail).required(),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, {}) => {
    try {
      if (!image) {
        setImgPickerErr("Image is required");
        return;
      }

      if (!place) {
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
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        address: place.formatted_address,
        coverMedia: image,
      };
      await createBasicProfieAPI({ ...details });
      showToast(`Basic Information is saved.`, "success");
      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });
      setStep((prev) => ++prev);
      saveInSecureLS(SECURE_LS_TOKENS.PROFILE_STEP, "2");
    } catch (error) {
      showLogMessage(`ERROR ~ ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full items-center p-5">
      <Formik
        enableReinitialize
        initialValues={{
          name: "",
          email: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 flex w-full flex-col items-center gap-y-9 lg:max-w-[600px] max-w-[400px]">
          <div className="flex flex-col gap-y-4 w-full items-center">
            <ImagePicker error={imgPickerErr} onChange={setImage} />
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
          <AppButton type={"submit"} title={`Continue`} loading={isPending} />
        </Form>
      </Formik>
    </div>
  );
};
