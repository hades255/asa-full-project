import { Link, Outlet, useResolvedPath } from "react-router-dom";
import Applogo from "./Applogo";
import ProfileAvatar from "../../images/profile_avatar.svg";

const PublicRoute = () => {
  const { pathname } = useResolvedPath();

  return (
    <div className="lg:flex-row flex flex-1 flex-col">
      <div className="lg:w-1/2 lg:h-screen flex flex-col p-10 gap-y-14 bg-semantic-background-backgroundInversePrimary">
        <Applogo isWhite={true} size={100} />
        <div className="w-full lg:flex lg:flex-1 h-96 bg-semantic-background-backgroundInverseSecondary rounded-3xl" />
        <div className="flex flex-col gap-y-3">
          <p className="text-body1 font-normal text-semantic-content-contentInversePrimary">{`“All Spaces has saved me countless hours of searching and helped me find stunning spaces to my ease.”`}</p>
          <div className="flex items-center gap-x-3">
            <img
              src={ProfileAvatar}
              alt="Profile"
              className="w-[40px] h-[40px]"
            />
            <div className="flex flex-col">
              <p className="text-body1 font-normal text-semantic-content-contentInversePrimary">{`Chris Dockrill`}</p>
              <p className="text-caption1 font-normal text-semantic-content-contentInverseTertionary">{`Manager at Hilton Hotel`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:1/2 lg:h-screen flex flex-1 flex-col p-10 gap-y-14 bg-semantic-background-backgroundPrimary">
        <div className="flex flex-row items-center justify-end">
          <Link
            to={pathname == "/signin" ? "/signup" : "/signin"}
            className="py-2 px-4 text-button1 font-medium"
          >
            {pathname == "/signin" ? `Signup` : `Login`}
          </Link>
          <Link to="/contact-us" className="py-2 px-4 text-button1 font-medium">
            Contact Support
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicRoute;
