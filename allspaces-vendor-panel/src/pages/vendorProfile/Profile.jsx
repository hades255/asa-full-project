import {
  Building,
  Gallery,
  ProfileCircle,
  Security,
  Setting2,
} from "iconsax-react";
import React, { useState } from "react";
import { ProfileBasic } from "./ProfileBasic";
import { ProfileFacility } from "./ProfileFacility";
import { ProfileServices } from "./ProfileServices";
import { ProfileMedia } from "./ProfileMedia";
import { AppButton } from "../../components";
import { useAuth } from "../../context/AuthContext";
import {
  PROFILE_API_ROUTES,
  useToggleProfileStatus,
} from "../../api/profilesApis";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../utils/logs";
import { ProfileSecurity } from "./ProfileSecurity";

export const Profile = () => {
  const { profile: vendorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    {
      id: "basic",
      label: "About",
      icon: <ProfileCircle className="w-6 h-6" />,
    },
    {
      id: "facilities",
      label: "Facilities",
      icon: <Building className="w-6 h-6" />,
    },
    {
      id: "services",
      label: "Services",
      icon: <Setting2 className="w-6 h-6" />,
    },
    { id: "media", label: "Media", icon: <Gallery className="w-6 h-6" /> },
    {
      id: "security",
      label: "Security",
      icon: <Security className="w-6 h-6" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return <ProfileBasic />;
      case "facilities":
        return <ProfileFacility />;
      case "services":
        return <ProfileServices />;
      case "media":
        return <ProfileMedia />;
      case "security":
        return <ProfileSecurity />;
      default:
        return null;
    }
  };

  const {
    mutateAsync: toggleProfileStatusAPI,
    isPending: toggleProfileLoading,
  } = useToggleProfileStatus();
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-1 flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`Profile`}</h1>
        <AppButton
          onClick={async () => {
            await toggleProfileStatusAPI();
            queryClient.invalidateQueries({
              queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
            });
            showToast(
              `Your profile is ${
                vendorProfile?.profile.status === "INACTIVE"
                  ? "published"
                  : "unpublished"
              }`,
              "success"
            );
          }}
          width={`w-[124px]`}
          loading={toggleProfileLoading}
          title={
            vendorProfile?.profile.status === "INACTIVE"
              ? "Publish"
              : "Unpublish"
          }
        />
      </div>
      <div className="flex flex-1 flex-col w-full h-full bg-semantic-background-backgroundPrimary rounded-2xl shadow-md p-6 overflow-hidden">
        {/* Tabs Header */}
        <div className="flex items-center flex-wrap gap-3 border-b pb-4 border-b-semantic-background-backgroundTertionary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
              ${
                activeTab === tab.id
                  ? "bg-semanticExtensions-background-backgroundAccent text-semantic-content-contentInversePrimary shadow-sm"
                  : "text-semantic-content-contentInverseTertionary hover:bg-semanticExtensions-background-backgroundStateDisabled"
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 flex flex-1 w-full h-full overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
