import { ErrorMessage, Field } from "formik";
import { ArrowDown, ArrowDown2 } from "iconsax-react";

const AppSelect = ({ id, name, label, options = [], placeholder }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="text-semantic-content-contentPrimary text-button1 font-medium pl-4"
      >
        {label}
      </label>

      {/* Dropdown Wrapper */}
      <div className="relative bg-semantic-background-backgroundSecondary h-[55px] rounded-full px-4 flex items-center">
        <Field
          as="select"
          id={id}
          name={name}
          className="appearance-none [background-image:none] [&::-ms-expand]:hidden flex-1 w-full bg-transparent text-body1 font-medium text-semantic-content-contentPrimary placeholder-semantic-content-contentInverseTertionary border-none focus:outline-none focus:ring-0 p-0"
        >
          {/* Placeholder */}
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {/* Options */}
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>

        {/* Dropdown Icon */}
        <ArrowDown2 className="absolute right-4 text-semantic-content-contentInverseTertionary w-[20px] h-[20px] pointer-events-none" />
      </div>

      {/* Error Message */}
      <ErrorMessage
        name={name}
        component="div"
        className="text-semanticExtensions-content-contentNegative text-caption1 pl-4"
      />
    </div>
  );
};

export default AppSelect;
