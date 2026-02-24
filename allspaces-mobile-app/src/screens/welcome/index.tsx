import { View } from "react-native";
import React from "react";
import { T_WELCOME_SCREEN } from "./types";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import {
  gotoCreateAccountFromWelcome,
  gotoLoginFromWelcome,
} from "@/navigation/service";
import { Logo } from "assets/images";
import { useUnistyles } from "react-native-unistyles";

const Welcome: React.FC<T_WELCOME_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.logoContainer}>
            <Logo width={224} height={224} />
          </View>
          <View style={styles.topContent}>
            <AppText
              font="heading2"
              textAlign="center"
            >{`Welcome To\nAll Spaces`}</AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
              textAlign="center"
            >{`Book a space or service in seconds`}</AppText>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <AppButton
            title={`Sign Up`}
            onPress={() => {
              gotoCreateAccountFromWelcome(navigation);
            }}
          />
          <AppButton
            onPress={() => {
              gotoLoginFromWelcome(navigation);
            }}
            title={`Log In`}
            variant="text-btn"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
