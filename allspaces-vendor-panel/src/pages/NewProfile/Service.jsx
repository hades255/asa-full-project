import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  PROFILE_API_ROUTES,
  useAddProfileService,
  useGetProfileCategories,
  useGetProfileSubCategories,
  useToggleProfileStatus,
} from "../../api/profilesApis";
import { Loader } from "../../components/Loader";
import { FORM_ERRORS } from "../../utils/formErrors";
import { Form, Formik } from "formik";
import { showLogMessage, showToast } from "../../utils/logs";
import { ImagePicker } from "../../components/ImagePicker";
import { AppButton, AppInput } from "../../components";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { removeFromSecureLS, SECURE_LS_TOKENS } from "../../utils/secureLs";

export const Service = ({ setStep }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [image, setImage] = useState(null);
  const [imgPickerErr, setImgPickerErr] = useState("");

  const queryClient = useQueryClient();
  const { data: categories, isPending: catLoading } = useGetProfileCategories();
  const {
    mutateAsync: getProfileSubcategories,
    data: subCategories,
    isPending: subcatLoading,
  } = useGetProfileSubCategories();
  const {
    mutateAsync: addProfileServiceAPI,
    isPending: addProfileServiceAPILoading,
  } = useAddProfileService();

  const {
    mutateAsync: toggleProfileStatusAPI,
    isPending: toggleProfileLoading,
  } = useToggleProfileStatus();

  if (catLoading) return <Loader color={"#000"} />;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_ERRORS.invalidName),
    minSpend: Yup.number()
      .typeError(FORM_ERRORS.invalidMinspend)
      .required(FORM_ERRORS.requireMinspend),
    description: Yup.string().required(FORM_ERRORS.requireDescription),
  });

  const handleSubmit = async (values, {}) => {
    try {
      if (!profile) return;

      if (!image) {
        setImgPickerErr(`Image is required`);
        return;
      }

      await addProfileServiceAPI({
        name: values.name,
        description: values.description,
        categoryId: selectedSubcategory.id,
        minSpend: values.minSpend,
        media: image,
      });

      await toggleProfileStatusAPI();

      await queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      showToast(`You have successfully setup your profile.`, "success");
      navigate("/", { replace: true });
      removeFromSecureLS(SECURE_LS_TOKENS.PROFILE_STEP);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full p-5 items-center gap-y-9">
      <>
        <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary">{`Select Category`}</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories?.map((category, index) => {
            const isSelected = category.id === selectedCategory?.id;
            return (
              <div
                key={index}
                onClick={async () => {
                  setSelectedCategory(category);
                  await getProfileSubcategories(category.id);
                }}
                className={`${
                  isSelected
                    ? "border-core-accent"
                    : "border-semantic-background-backgroundTertionary"
                } flex text-center flex-col w-40 h-40 rounded-2xl hover:border-core-accent transition-all duration-300 items-center justify-center gap-y-2 border`}
              >
                <img
                  src={category.image}
                  alt="Category"
                  className="w-10 h-10"
                />
                <p className="font-medium text-body1 text-semantic-content-contentPrimary">
                  {category.title}
                </p>
              </div>
            );
          })}
        </div>
      </>
      {selectedCategory ? (
        subcatLoading ? (
          <Loader color={"#000"} />
        ) : (
          <>
            <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary">{`Select Sub Category`}</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {subCategories?.map((subcategory, index) => {
                const isSelected = subcategory.id === selectedSubcategory?.id;
                return (
                  <div
                    key={index}
                    onClick={async () => {
                      setSelectedSubcategory(subcategory);
                    }}
                    className={`${
                      isSelected
                        ? "border-core-accent"
                        : "border-semantic-background-backgroundTertionary"
                    } flex text-center flex-col w-40 h-40 rounded-2xl hover:border-core-accent transition-all duration-300 items-center justify-center gap-y-2 border`}
                  >
                    <img
                      src={subcategory.image}
                      alt="Category"
                      className="w-10 h-10"
                    />
                    <p className="font-medium text-body1 text-semantic-content-contentPrimary">
                      {subcategory.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )
      ) : null}

      {selectedSubcategory && (
        <>
          <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary">{`Further Details`}</h2>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
              minSpend: "",
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
                  placeholder={`e.g. Massage`}
                />
                <AppInput
                  id={"minSpend"}
                  name={"minSpend"}
                  label={`Min Spend`}
                  placeholder={`e.g. 22`}
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
                title={`Continue`}
                loading={addProfileServiceAPILoading}
              />
            </Form>
          </Formik>
        </>
      )}
    </div>
  );
};
