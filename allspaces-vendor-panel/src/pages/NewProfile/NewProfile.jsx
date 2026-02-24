import { useEffect, useState } from "react";
import { BasicProfile } from "./BasicProfile";
import { Header } from "../../components/Header";
import { Facility } from "./Facility";
import { useAuth } from "../../context/AuthContext";
import { useGetProfile } from "../../api/profilesApis";
import { Loader } from "../../components/Loader";
import { Service } from "./Service";
import { getFromSecureLS, SECURE_LS_TOKENS } from "../../utils/secureLs";

export const NewProfile = () => {
  const { setProfile } = useAuth();
  const { data: vendorProfile, isPending } = useGetProfile();
  const [isReady, setReady] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setProfile(vendorProfile);
  }, [vendorProfile]);

  useEffect(() => {
    const fetchStepDetails = () => {
      const stepCount = getFromSecureLS(SECURE_LS_TOKENS.PROFILE_STEP);
      if (stepCount) setStep(Number(stepCount));
      setReady(true);
    };
    fetchStepDetails();
  }, []);

  if (isPending || !isReady) return <Loader color={"#000"} />;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicProfile setStep={setStep} />;
      case 2:
        return <Facility setStep={setStep} />;
      case 3:
        return <Service setStep={setStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col w-screen h-screen bg-semantic-background-backgroundPrimary">
      <Header newProfile={true} />
      <div className="flex flex-col gap-y-1 p-5">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`Setup Vendor Profile`}</h1>
        <p className="font-normal text-body1 text-semantic-content-contentTertionary">{`Please setup your vendor profile to continue`}</p>
      </div>
      <div className="flex justify-between mb-6">
        {["Basic Information", "Facility", "Service"].map((label, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-body2 font-semibold 
              ${
                step === index + 1
                  ? "bg-semanticExtensions-background-backgroundAccent text-semantic-content-contentInversePrimary"
                  : step > index + 1
                  ? "bg-semanticExtensions-background-backgroundPositive text-semantic-content-contentInversePrimary"
                  : "bg-semantic-background-backgroundTertionary text-semantic-content-contentSecondary"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`text-caption1 mt-1 ${
                step === index + 1
                  ? "text-semanticExtensions-content-contentAccent font-medium"
                  : "text-semantic-content-contentTertionary"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 w-full h-full">{renderStep()}</div>
    </div>
  );
};
