import { View } from "react-native";
import React from "react";

import { AppButton, AppText, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { T_PAYMENT_SUCCESSFULLY_SCREEN } from "./types";
import { TickCircle } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
const PaymentSuccessfully: React.FC<T_PAYMENT_SUCCESSFULLY_SCREEN> = ({
  navigation,
}) => {
  const { theme } = useUnistyles();
  return (
    <ScreenWrapper withoutBottomPadding>
      <View style={styles.mainContainer}>
        <TickCircle
          size={100}
          color={theme.colors.semanticExtensions.content.contentPositive}
        />

        <View style={{ rowGap: theme.units[1] }}>
          <AppText
            font="heading2"
            textAlign="center"
          >{`Booking is\nConfirmed`}</AppText>
          <AppText
            font="body1"
            textAlign="center"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`You booking is confirmed and sent\nto respective vendor`}</AppText>
        </View>
        <AppButton title="View Booking" onPress={() => {
          navigation.getParent()?.navigate("BookingsStack")
        }} />
      </View>
    </ScreenWrapper>
  );
};

export default PaymentSuccessfully;
