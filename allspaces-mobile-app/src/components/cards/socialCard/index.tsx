import { View, Text, Alert } from "react-native";
import React from "react";
import { T_SOCIAL_CARD } from "./types";
import { styles } from "./styles";
import { TickCircle } from "iconsax-react-native";
import ButtonWrapper from "@/components/buttonWrapper";
import { useUnistyles } from "react-native-unistyles";

const SocialCard: React.FC<T_SOCIAL_CARD> = ({
  socialItem,
  connectedAccounts,
  onSocialCardPress,
}) => {
  const { theme } = useUnistyles();
  const isConnected = connectedAccounts.find(
    (item) => item.key === socialItem.key
  );
  return (
    <ButtonWrapper
      onPress={() => {
        if (isConnected) {
          Alert.alert("Sorry", "This account is already connected");
          return;
        }
        onSocialCardPress(socialItem);
      }}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <View style={styles.leftContainer}>
        {socialItem.icon}
        <Text style={styles.title}>{`${!isConnected ? "Connect" : ""} ${
          socialItem.title
        } ${isConnected ? "Connected" : ""}`}</Text>
      </View>
      {isConnected && (
        <TickCircle
          size={24}
          color={theme.colors.semanticExtensions.content.contentPositive}
        />
      )}
    </ButtonWrapper>
  );
};

export default SocialCard;
