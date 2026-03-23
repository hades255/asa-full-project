import { useUser } from "@clerk/clerk-expo";
import { useMemo } from "react";

export const useProfileProvider = () => {
  const { isLoaded, user } = useUser();
  const checkProfileCompletion = () => {
    try {
      if (!isLoaded || !user) return undefined;
      return Boolean(
        user.firstName &&
          user.phoneNumbers.length > 0 &&
          user.phoneNumbers[0].verification.status === "verified" &&
          user.verifiedExternalAccounts.length > 0 &&
          user.unsafeMetadata.hasPaymentMethod &&
          user.unsafeMetadata.hasPreferences
      );
    } catch (error) {
      return false;
    }
  };

  const isProfileCompleted = useMemo(
    () => checkProfileCompletion(),
    [isLoaded, user]
  );

  return { isProfileCompleted, checkProfileCompletion };
};
