import { View } from "react-native";
import React from "react";
import { T_LOGIN_METHODS_SCREEN } from "./types";
import { AppSwitch, AppText, Header2, ScreenWrapper } from "@/components";
import useBiometric from "@/hooks/useBiometric";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";

const LoginMethods: React.FC<T_LOGIN_METHODS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const { isBiometricEnabled, toggleBiometric } = useBiometric();
  const { hasCredentials } = useLocalCredentials();

  const toggleBiometricLogin = async (value: boolean) => {
    await toggleBiometric(value);
  };

  return (
    <ScreenWrapper>
      <Header2 title="Login Methods" />
      <View style={styles.mainContainer}>
        <View style={{ rowGap: theme.units[4] }}>
          <View style={styles.row}>
            <AppText font={"body1"}>{`Biometric Login`}</AppText>
            <AppSwitch
              value={isBiometricEnabled || false}
              onValueChange={toggleBiometricLogin}
              disabled={!hasCredentials}
            />
          </View>
          {!hasCredentials && (
            <AppText 
              font="caption1" 
              color={theme.colors.semantic.content.contentInverseTertionary}
            >
              Please login with email and password first to enable biometric authentication.
            </AppText>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginMethods;
