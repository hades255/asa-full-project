import { Field } from "formik";

function AppCheckbox({ name, label }) {
  return (
    <label className="flex items-center gap-x-3">
      <Field
        type="checkbox"
        name={name}
        className="w-4 h-4 text-semantic-content-contentPrimary rounded-[4px]"
      />
      <span className="font-normal text-body1 text-semantic-content-contentPrimary">
        {label}
      </span>
    </label>
  );
}

export default AppCheckbox;
