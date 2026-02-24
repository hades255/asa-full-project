import { showSnackbar } from "@/utils/essentials";
import { useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { OAuthStrategy } from "@clerk/types";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const useSocialAuth = () => {
  useWarmUpBrowser();

  const { user, isLoaded } = useUser();

  useEffect(() => {
    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log("App opened with URL:", url);
      }
    };

    const listener = Linking.addEventListener("url", (event) => {
      console.log("URL event:", event.url);
    });

    getInitialUrl();

    return () => listener.remove();
  }, []);

  const connectSocialAccount = async ({ type }: { type: OAuthStrategy }) => {
    try {
      if (!user || !isLoaded) {
        showSnackbar(`Clerk User should be logged in first`, "warning");
        return;
      }

      const redirectUri = Linking.createURL("sso-callback");

      const { verification } = await user.createExternalAccount({
        strategy: type,
        redirectUrl: redirectUri,
      });

      const result = await WebBrowser.openAuthSessionAsync(
        // @ts-ignore
        verification?.externalVerificationRedirectURL?.toString(),
        redirectUri
      );

      await user.reload();

      let acc = user.externalAccounts.find(
        (item) => item.verification?.strategy === type
      );

      if (result.type === "success") {
        if (acc?.verification?.error) {
          showSnackbar(acc?.verification.error.message, "error");
          return;
        } else if (acc?.verification?.status === "verified") {
          await user.reload();
          showSnackbar(
            `${
              acc.provider.charAt(0).toUpperCase() + acc.provider.slice(1)
            } account is configured`,
            "success"
          );
        }
      } else {
        showSnackbar(`Something went wrong`, "error");
      }
    } catch (error: any) {
      showSnackbar(`${JSON.stringify(error)}`, "error");
    }
  };

  const removeSocialAccount = async ({ type }: { type: OAuthStrategy }) => {
    try {
      if (!user) return;

      let acc = user.verifiedExternalAccounts.find(
        (item) => item.verification?.strategy === type
      );

      if (acc) {
        await acc.destroy();
        await user.reload();
      } else showSnackbar(`Account is not connected!`, "warning");
    } catch (error) {
      showSnackbar(`${JSON.stringify(error)}`, "error");
    }
  };

  return {
    connectSocialAccount,
    removeSocialAccount,
  };
};

export default useSocialAuth;
