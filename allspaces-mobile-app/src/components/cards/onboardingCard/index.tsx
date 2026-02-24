import { View } from "react-native";
import React from "react";
import { T_ONBOARDING_CARD } from "./types";
import { globalStyles } from "@/theme";
import { styles } from "./styles";
import LottieView from "lottie-react-native";
import AppText from "@/components/appText";
import { useUnistyles } from "react-native-unistyles";

const OnboardingCard: React.FC<T_ONBOARDING_CARD> = ({ onboardingItem }) => {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        globalStyles.mainContainer,
        styles.bodyContainer,
        globalStyles.h16Padding,
      ]}
    >
      <LottieView
        source={onboardingItem.lottieAnimation}
        autoPlay
        loop
        style={styles.lottieContainer}
      />
      <View style={styles.contentContainer}>
        <AppText font="heading2" textAlign="center">
          {onboardingItem.title}
        </AppText>
        <AppText
          font="body1"
          color={theme.colors.semantic.content.contentInverseTertionary}
          textAlign="center"
        >
          {onboardingItem.info}
        </AppText>
      </View>
    </View>
  );
};

export default OnboardingCard;
