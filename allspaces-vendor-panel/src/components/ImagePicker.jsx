import { CloseCircle, Gallery } from "iconsax-react";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export const ImagePicker = ({ className, onChange, error, alreadyPreview }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (alreadyPreview) setPreview(alreadyPreview);
  }, [alreadyPreview]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange && onChange(file);
      }
    },
    [onChange]
  );

  const removeImage = () => {
    setPreview(null);
    onChange && onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <>
      <div className={"w-full"}>
        <div
          {...getRootProps()}
          className={`border border-dashed bg-semantic-background-backgroundSecondary rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-semantic-background-backgroundInversePrimary"
              : "border-semantic-content-contentInverseTertionary hover:border-semantic-background-backgroundInversePrimary"
          }
          ${preview ? "relative" : ""}
        `}
        >
          <input {...getInputProps()} />

          {!preview ? (
            <div className="flex flex-col items-center gap-y-1 text-center w-full">
              <Gallery className="w-10 h-10 text-semantic-content-contentInverseTertionary" />
              <p className="text-semantic-content-contentInverseTertionary font-medium text-body1">
                Click or drag image here
              </p>
              <p className="text-semantic-content-contentInverseTertionary font-normal text-body2">
                PNG, JPG up to 5MB
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-2xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-semantic-background-backgroundInversePrimary text-semantic-content-contentInversePrimary rounded-full p-1 transition"
              >
                <CloseCircle className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="w-full">
          <p className="text-semanticExtensions-content-contentNegative text-caption1 pl-4">
            {error}
          </p>
        </div>
      )}
    </>
  );
};
