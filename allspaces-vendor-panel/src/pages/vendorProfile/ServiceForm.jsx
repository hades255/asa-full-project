import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  PROFILE_API_ROUTES,
  useAddProfileService,
  useEditProfileService,
  useGetProfileCategories,
  useGetProfileSubCategories,
} from "../../api/profilesApis";
import { Loader } from "../../components/Loader";
import * as Yup from "yup";
import { FORM_ERRORS } from "../../utils/formErrors";
import { showToast } from "../../utils/logs";
import { Modal } from "../../components/Modal";
import { Form, Formik } from "formik";
import { ImagePicker } from "../../components/ImagePicker";
import { AppButton, AppInput } from "../../components";

export const ServiceForm = ({
  service,
  setService,
  modalOpen,
  setModalOpen,
}) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [image, setImage] = useState(null);
  const [imgPickerErr, setImgPickerErr] = useState("");
  const [preview, setPreview] = useState(null);

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
    mutateAsync: editProfileServiceAPI,
    isPending: editProfileServiceAPILoading,
  } = useEditProfileService();

  // Effect to fill form for editing
  useEffect(() => {
    if (service) {
      setPreview(service.media);
      const findCategory = categories.find(
        (item) => item.id === service.categoryId
      );
      if (findCategory) {
        setSelectedCategory(findCategory);
        getProfileSubcategories(findCategory.id)
          .then((subcats) => {
            const findSubcategory = subcats.find(
              (item) => item.id === service.subCategoryId
            );
            if (findSubcategory) setSelectedSubcategory(findSubcategory);
          })
          .catch((err) => {
            showToast(err, "error");
          });
      }
    } else {
      setPreview(null);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  }, [service]);

  if (catLoading) return <Loader color={"#000"} />;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_ERRORS.invalidName),
    minSpend: Yup.number()
      .typeError(FORM_ERRORS.invalidMinspend)
      .required(FORM_ERRORS.requireMinspend),
    description: Yup.string().required(FORM_ERRORS.requireDescription),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (!profile) return;

      if (!image) {
        setImgPickerErr(`Image is required`);
        return;
      }

      if (!service) {
        await addProfileServiceAPI({
          name: values.name,
          description: values.description,
          categoryId: selectedSubcategory.id,
          minSpend: values.minSpend,
          media: image,
        });
      } else {
        await editProfileServiceAPI({
          serviceId: service.id,
          name: values.name,
          description: values.description,
          categoryId: selectedSubcategory.id,
          minSpend: values.minSpend,
          media: image,
        });
      }
      queryClient.invalidateQueries({
        queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
      });

      showToast(`Service is ${service ? "edited" : "added"}`, "success");
      resetForm();
      setModalOpen((prev) => !prev);
      setService(null);
    } catch (error) {
      showToast(`${error}`, "error");
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen((prev) => !prev);
        setService(null);
      }}
      title={`${service ? `Edit` : `Add`} Service`}
    >
      {!selectedCategory || service ? (
        <>
          <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary mb-4">{`Select Category`}</h2>
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
      ) : null}
      {(selectedCategory && !selectedSubcategory) || service ? (
        subcatLoading ? (
          <Loader color={"#000"} />
        ) : (
          <>
            <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary mb-4">{`Select Sub Category`}</h2>
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

      {(selectedSubcategory || service) && (
        <>
          <h2 className="font-medium text-heading3 text-semantic-content-contentPrimary mb-4">{`Further Details`}</h2>
          <Formik
            enableReinitialize
            initialValues={{
              name: service?.name || "",
              minSpend: service?.minSpend || "",
              description: service?.description || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="flex-1 flex w-full flex-col items-center gap-y-9 lg:max-w-[600px] max-w-[400px]">
              <div className="flex flex-col gap-y-4 w-full items-center">
                <ImagePicker
                  error={imgPickerErr}
                  onChange={setImage}
                  alreadyPreview={preview}
                />
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
                loading={
                  addProfileServiceAPILoading || editProfileServiceAPILoading
                }
              />
            </Form>
          </Formik>
        </>
      )}
    </Modal>
  );
};
