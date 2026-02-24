import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export const useProfileProvider = () => {
  const { isLoaded, user } = useUser();
  const [isProfileCompleted, setProfileCompleted] = useState<
    boolean | undefined
  >(undefined);

  const checkProfileCompletion = () => {
    try {
      if (!isLoaded || !user) return;

      if (
        user.firstName &&
        user.phoneNumbers.length > 0 &&
        user.phoneNumbers[0].verification.status === "verified" &&
        user.verifiedExternalAccounts.length > 0 &&
        user.unsafeMetadata.hasPaymentMethod &&
        user.unsafeMetadata.hasPreferences
      )
        setProfileCompleted(true);
      else setProfileCompleted(false);
    } catch (error) {
      setProfileCompleted(false);
    }
  };

  useEffect(() => {
    checkProfileCompletion();
  }, [user, isLoaded]);

  return { checkProfileCompletion, isProfileCompleted };
};
