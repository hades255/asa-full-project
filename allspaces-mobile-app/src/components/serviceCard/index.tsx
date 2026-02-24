import { View } from "react-native";
import React from "react";
import { T_SERVICE_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import { TickCircle } from "iconsax-react-native";
import ButtonWrapper from "../buttonWrapper";

const ServiceCard: React.FC<T_SERVICE_CARD> = ({
  isSelected,
  onPress,
  service,
}) => {
  const { theme } = useUnistyles();

  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <View style={styles.leftContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={{ uri: service.media }}
            contentFit="cover"
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.leftContent}>
          <AppText font="body2">{service.name}</AppText>
          <AppText
            font="caption2"
            color={theme.colors.semantic.content.contentTertionary}
          >
            {service.description}
          </AppText>
          <AppText font="body2">{`$ ${service.minSpend.toFixed(
            2
          )} min.spend`}</AppText>
        </View>
      </View>
      {isSelected && (
        <TickCircle
          size={24}
          color={theme.colors.semanticExtensions.content.contentPositive}
        />
      )}
    </ButtonWrapper>
  );
};

export default ServiceCard;
