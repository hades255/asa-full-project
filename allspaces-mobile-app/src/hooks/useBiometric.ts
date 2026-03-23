import { SecureStoreService } from "@/config/secureStore";
import { useCallback, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";
import { showSnackbar } from "@/utils/essentials";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "@/redux/hooks";
import { actionSetShowBiometricModal } from "@/redux/app.slice";
import { Platform } from "react-native";

const useBiometric = () => {
  const { biometricType } = useLocalCredentials();
  const [isBiometricEnabled, setBiometricEnabled] = useState<
    boolean | undefined
  >(undefined);
  const dispatch = useDispatch();
  const [biometricAsked, setBiometricAsked] = useState<boolean | undefined>(
    undefined
  );

  const type =
    biometricType || (Platform.OS === "ios" ? "Face ID" : "Biometric");

  const checkBiometricEnabled = async () => {
    const isEnabled = await SecureStoreService.getValue("BIOMETRIC_ENABLED");
    const isAsked = await SecureStoreService.getValue("BIOMETRIC_ASKED");

    // Update biometricAsked state based on stored value
    setBiometricAsked(isAsked == null ? false : true);
    // Always set a boolean value, never null
    setBiometricEnabled(isEnabled == null ? false : true);
  };

  useFocusEffect(
    useCallback(() => {
      checkBiometricEnabled();
    }, [])
  );

  const checkLocalAuthAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && supportedTypes.length > 0 && isEnrolled && biometricType)
      return true;
    else return false;
  };

  const toggleBiometric = async (value: boolean) => {
    try {
      const isLocalAuthAvailable = await checkLocalAuthAvailability();
      if (isLocalAuthAvailable) {
        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate ${type}`,
        });

        if (auth.success) {
          if (value) {
            await SecureStoreService.saveValue("BIOMETRIC_ENABLED", "true");
            // Set BIOMETRIC_ASKED flag when user enables biometric
            await SecureStoreService.saveValue("BIOMETRIC_ASKED", "true");
            setBiometricEnabled(true);
            setBiometricAsked(true);
            dispatch(actionSetShowBiometricModal(false));
          } else {
            await SecureStoreService.deleteValue("BIOMETRIC_ENABLED");
            setBiometricEnabled(false);
          }

          showSnackbar(
            `${type} authentication is ${value ? "setup" : "removed"}!`,
            "success"
          );
        } else {
          showSnackbar(`${type} authentication failed!`, "error");
        }
      } else {
        showSnackbar(
          `Your device isn't supported or you didn't enroll any biometric.`,
          "error"
        );
      }
    } catch (error) {
      showSnackbar(`Something went wrong, please try again!`, "error");
    }
  };

  const authBiometric = async () => {
    try {
      const isLocalAuthAvailable = await checkLocalAuthAvailability();

      if (isLocalAuthAvailable) {
        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate ${type}`,
        });
        if (auth.success) {
          return true;
        } else return false;
      } else return false;
    } catch (error) {
      return false;
    }
  };

  return {
    isBiometricEnabled,
    authBiometric,
    toggleBiometric,
    biometricAsked,
    refreshBiometricState: checkBiometricEnabled,
  };
};

export default useBiometric;
