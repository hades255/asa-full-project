import Logo from "../../images/logo.svg";
import WhiteLogo from "../../images/logo-white.svg";

const Applogo = ({ className, isWhite = false }) => {
  return (
    <img
      src={isWhite ? WhiteLogo : Logo}
      alt="Logo"
      className={className || "w-[100px] h-[100px]"}
    />
  );
};

export default Applogo;
