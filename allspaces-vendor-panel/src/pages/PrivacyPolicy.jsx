import { useGetPrivacyPolicy } from "../api/contactsApis";
import { Loader } from "../components/Loader";

export const PrivacyPolicy = () => {
  const { data: privacyPolicy, isPending } = useGetPrivacyPolicy();

  return (
    <div className="flex flex-1 h-full flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`Privacy & Policy`}</h1>
      </div>
      <div className="flex flex-1 bg-semantic-background-backgroundPrimary rounded-2xl shadow-md p-6 overflow-y-auto">
        {isPending ? (
          <Loader />
        ) : (
          <p className="font-normal text-body1 text-semantic-content-contentPrimary">
            {privacyPolicy.content}
          </p>
        )}
      </div>
    </div>
  );
};
