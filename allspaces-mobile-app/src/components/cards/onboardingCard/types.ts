import { AnimationObject } from "lottie-react-native";

export type T_ONBOARDING_ITEM = {
  key: string;
  title: string;
  info: string;
  lottieAnimation:
    | string
    | AnimationObject
    | {
        uri: string;
      }
    | undefined;
};

export type T_ONBOARDING_CARD = {
  onboardingItem: T_ONBOARDING_ITEM;
};
