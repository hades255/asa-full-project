import { Bars } from "react-loader-spinner";

export const Loader = ({ color, fullScreen }) => {
  return (
    <div
      className={`flex flex-1 ${
        fullScreen ? "w-screen h-screen" : "w-full h-full"
      } items-center justify-center`}
    >
      <Bars
        height="32"
        width="32"
        color={color || "#000"}
        ariaLabel="bars-loading"
        visible={true}
      />
    </div>
  );
};
