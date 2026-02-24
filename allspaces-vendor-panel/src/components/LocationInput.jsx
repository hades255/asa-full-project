import { Location } from "iconsax-react";
import { usePlacesWidget } from "react-google-autocomplete";
import { VITE_GOOGLE_API_KEY } from "../utils/envConfig";

export const LocationInput = ({
  width = 400,
  label,
  placeholder,
  value,
  onChange,
  place,
  setPlace,
  error,
}) => {
  const { ref } = usePlacesWidget({
    apiKey: VITE_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      setPlace(place);
      onChange(place?.formatted_address);
    },
    options: {
      types: ["postal_code"],
      componentRestrictions: { country: [] }, // global
    },
  });

  return (
    <div className={`flex flex-col gap-y-2 w-full`}>
      <label
        className="text-semantic-content-contentPrimary text-button1 font-medium pl-4"
        htmlFor={"location"}
      >
        {label}
      </label>
      <div
        className={`flex bg-semantic-background-backgroundSecondary px-4 gap-x-4 h-[55px] rounded-full items-center`}
      >
        <Location className="w-6 h-6 text-semantic-content-contentPrimary" />
        <input
          ref={ref}
          placeholder={placeholder}
          className="flex flex-1 w-full h-full bg-transparent resize-none text-body1 font-medium text-semantic-content-contentPrimary placeholder-semantic-content-contentInverseTertionary border-none focus:outline-none focus:ring-0 p-0"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!e.target.value) {
              setPlace(null);
            }
          }}
        />
      </div>
      {error && (
        <p className="text-semanticExtensions-content-contentNegative text-caption1 pl-4">
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
