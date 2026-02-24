import { ErrorMessage, Field } from "formik";

const OtpInput = ({ id, name, values, setFieldValue }) => {
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    if (!element.value && element.previousSibling) {
      // Move to the previous input if value removed
      element.previousSibling.focus();
    } else if (element.value && element.nextSibling) {
      // Move to the next input
      element.nextSibling.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-normal gap-y-2">
      <div className="flex items-center justify-center gap-x-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Field
            key={index.toString()}
            type={"text"}
            id={id}
            name={name}
            value={values.otp[index]}
            onChange={(e) => {
              let newOtp = values.otp.split("");
              newOtp[index] = e.target.value.replace(/\D/, ""); // Ensure only digits
              setFieldValue("otp", newOtp.join(""));
              handleChange(e.target, index);
            }}
            className="w-11 h-11 outline-none border rounded-lg text-semantic-content-contentPrimary text-center text-heading4 font-medium focus:outline-none"
          />
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-semanticExtensions-content-contentNegative text-caption1 pl-4"
      />
    </div>
  );
};

export default OtpInput;
