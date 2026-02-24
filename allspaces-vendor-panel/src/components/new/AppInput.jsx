import { useState } from "react";
import { ErrorMessage, Field } from "formik";
import { Eye, EyeSlash } from "iconsax-react";

function AppInput({ width = 400, label, placeholder, id, name, icon, type }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-y-2 w-full`}>
      <label
        className="text-semantic-content-contentPrimary text-button1 font-medium pl-4"
        htmlFor={id}
      >
        {label}
      </label>
      <div
        className={`flex bg-semantic-background-backgroundSecondary px-4 gap-x-4 ${
          type === "textarea"
            ? "h-[124px] rounded-2xl items-start py-3"
            : "h-[55px] rounded-full items-center"
        }`}
      >
        {icon && type !== "textarea" && icon}

        {type === "textarea" ? (
          <Field
            as={"textarea"}
            id={id}
            name={name}
            rows={5}
            placeholder={placeholder}
            className="flex flex-1 w-full h-full bg-transparent resize-none text-body1 font-medium text-semantic-content-contentPrimary placeholder-semantic-content-contentInverseTertionary border-none focus:outline-none focus:ring-0 p-0"
          />
        ) : (
          <Field
            id={id}
            name={name}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            className="flex flex-1 w-full h-full bg-transparent text-body1 font-medium text-semantic-content-contentPrimary placeholder-semantic-content-contentInverseTertionary border-none focus:outline-none focus:ring-0 p-0"
          />
        )}

        {type == "password" ? (
          showPassword ? (
            <EyeSlash
              onClick={() => setShowPassword(!showPassword)}
              className="text-semantic-content-contentInverseTertionary w-[24px] h-[24px]"
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="text-semantic-content-contentInverseTertionary w-[24px] h-[24px]"
            />
          )
        ) : null}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-semanticExtensions-content-contentNegative text-caption1 pl-4"
      />
    </div>
  );
}

export default AppInput;
