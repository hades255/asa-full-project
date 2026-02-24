import { HambergerMenu, Logout } from "iconsax-react";
import Logo from "../images/logo.svg";
import { useAuth } from "../context/AuthContext";

export const Header = ({ onMenuClick, newProfile }) => {
  const { logout, setProfile, profile } = useAuth();

  return (
    <header
      className={`flex items-center justify-between bg-semantic-background-backgroundSecondary shadow-md lg:py-6 lg:shadow-none lg:bottom-1 lg:border-b  lg:px-0 px-5 py-5 sticky top-0 z-20 ${
        newProfile ? "lg:mx-0" : "lg:mx-6"
      } ${newProfile ? "lg:px-6" : "lg:px-0"}`}
    >
      <div className="flex items-start gap-x-3">
        {!newProfile && (
          <button className="lg:hidden text-gray-700" onClick={onMenuClick}>
            <HambergerMenu size={32} />
          </button>
        )}
        <div className="flex flex-col">
          <p className="font-normal text-body1 from-semantic-content-contentPrimary">{`Welcome,`}</p>
          <h1 className="leading-none text-heading2 font-semibold text-semantic-content-contentPrimary">{`${
            profile?.profile?.email.split("@")[0] || "Vendor"
          }`}</h1>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div
          className={`flex items-center gap-4 ${newProfile ? "" : "lg:hidden"}`}
        >
          <img src={Logo} alt="Logo" className="w-14 h-14" />
        </div>
        <button
          onClick={() => {
            logout();
            setProfile(null);
          }}
          className="gap-x-2 flex items-center justify-end text-heading4 font-medium text-semanticExtensions-content-contentNegative"
        >
          <Logout className="w-6 h-6" />
          <p>{`Logout`}</p>
        </button>
      </div>
    </header>
  );
};
