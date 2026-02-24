import { Bars } from "react-loader-spinner";

const AppButton = ({
  width,
  title,
  type,
  disabled,
  loading,
  className,
  onClick,
  variant = "default",
}) => {
  return (
    <button
      type={type}
      className={`${className} ${width || "w-full"} h-[55px] ${
        variant == "textBtn"
          ? "bg-transparent text-semantic-content-contentPrimary"
          : "bg-semantic-background-backgroundInversePrimary text-semantic-content-contentInversePrimary"
      }  text-center flex items-center justify-center rounded-full text-button1 font-medium`}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? (
        <Bars
          height="24"
          width="24"
          color="#fff"
          ariaLabel="bars-loading"
          visible={true}
        />
      ) : (
        title
      )}
    </button>
  );
};

export default AppButton;
