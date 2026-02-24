import React, { useEffect, useState } from 'react';

import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from "yup";
import ModalBasic from '../../components/ModalBasic';

function ProfileFacilityModal() {

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Facility name is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onSubmit(values); // Send data to backend
      resetForm();
      setFacilityModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setSubmitting(false);
  };

  return (
    <ModalBasic id="facility-modal" modalOpen={facilityModalOpen} setModalOpen={setFacilityModalOpen} title="Edit Facility">
      {/* Formik Form */}
      <Formik
        initialValues={{ name: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="px-5 py-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-black text-base font-medium mb-2 pl-4" htmlFor="name">
                    Name
                  </label>
                  <div className="flex items-center bg-extraLightLight rounded-full px-4 py-2">
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Free Wifi"
                      className="flex-1 w-full bg-transparent text-base font-normal text-lightGray px-4 py-2 border-none focus:border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1 pl-4" />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn rounded-full bg-black text-white shadow-sm transition duration-150 px-12 py-4"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBasic>
  );
}

export default ProfileFacilityModal;
