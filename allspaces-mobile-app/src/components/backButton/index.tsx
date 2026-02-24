import React from "react";
import { T_BACK_BUTTON } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { ArrowLeft2 } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";

const BackButton: React.FC<T_BACK_BUTTON> = ({}) => {
  const navigation = useNavigation();
  const { theme } = useUnistyles();
  return (
    <ButtonWrapper
      onPress={() => {
        if (navigation.canGoBack()) navigation.goBack();
      }}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <ArrowLeft2
        color={theme.colors.semantic.content.contentPrimary}
        size={24}
        variant="Linear"
      />
    </ButtonWrapper>
  );
};

export default BackButton;
