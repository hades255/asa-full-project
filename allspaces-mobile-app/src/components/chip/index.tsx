import React from "react";
import { T_CHIP } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";

const Chip: React.FC<T_CHIP> = ({ text, isSelected, onPress }) => {
  const { theme } = useUnistyles();
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: [
          styles.mainContainer,
          {
            backgroundColor: isSelected
              ? theme.colors.semanticExtensions.content.contentAccent
              : theme.colors.semantic.background.backgroundSecondary,
          },
        ],
      }}
    >
      <AppText
        font="caption1"
        color={
          isSelected
            ? theme.colors.semantic.content.contentInversePrimary
            : theme.colors.semantic.content.contentPrimary
        }
      >
        {text}
      </AppText>
    </ButtonWrapper>
  );
};

export default Chip;
