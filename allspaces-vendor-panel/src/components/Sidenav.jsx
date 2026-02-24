import {
  ClipboardText,
  Headphone,
  Home2,
  MessageQuestion,
  Notification1,
  Security,
  Task,
  User,
  UserOctagon,
} from "iconsax-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/logo.svg";
import { useEffect } from "react";

const navItems = [
  { name: "Dashboard", icon: <Home2 />, path: "/" },
  { name: "Profile", icon: <User />, path: "/profile" },
  { name: "Bookings", icon: <Task />, path: "/bookings" },
  { name: "Employees", icon: <UserOctagon />, path: "/employees" },
  { name: "Notifications", icon: <Notification1 />, path: "/notifications" },
  { name: "separator" },
  { name: "Privacy Policy", icon: <Security />, path: "/privacy-policy" },
  {
    name: "Terms & Conditions",
    icon: <ClipboardText />,
    path: "/terms-conditions",
  },
  { name: "FAQs", icon: <MessageQuestion />, path: "/faqs" },
  { name: "Contact Support", icon: <Headphone />, path: "/contact-support" },
];

export const Sidenav = ({ open, setOpen, collapsed, setCollapsed }) => {
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      <aside
        className={`fixed lg:static z-40 bg-semantic-background-backgroundPrimary h-full flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-80"
        } ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-6">
          {!collapsed && (
            <img src={Logo} alt="Loog" className="w-[100px] h-[100px]" />
          )}
        </div>

        <nav className="flex-1 px-4 py-3 gap-x-6 space-y-3 overflow-y-auto min-h-0">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return item.name === "separator" ? (
              <div
                key={index.toString()}
                className="h-[1px] bg-semantic-content-contentInverseSecondary w-full"
              />
            ) : (
              <Link
                key={index.toString()}
                to={item.path}
                className={`flex items-center gap-x-3 px-4 py-3 rounded-full font-medium text-button1 ${
                  isActive
                    ? "bg-semantic-background-backgroundInversePrimary text-semantic-content-contentInversePrimary"
                    : "transition-colors duration-500 hover:bg-semantic-background-backgroundInversePrimary text-semantic-content-contentTertionary lg:hover:text-semantic-content-contentInversePrimary"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
