import React from "react";
import { T_APP_BUTTON } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";

const AppButton: React.FC<T_APP_BUTTON> = ({
  title,
  variant,
  width,
  onPress,
  disabled,
  size,
  icon,
}) => {
  const { theme } = useUnistyles();
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        disabled: disabled,
        style: [
          size === "small" ? styles.smallButton : styles.mainContainer,
          {
            width: width ?? "100%",
            backgroundColor: disabled
              ? theme.colors.semanticExtensions.background
                  .backgroundStateDisabled
              : variant === "text-btn"
              ? "transparent"
              : variant === "secondary"
              ? theme.colors.semantic.background.backgroundSecondary
              : theme.colors.semanticExtensions.background.backgroundAccent,
          },
        ],
      }}
    >
      {icon}
      <AppText
        font={size === "small" ? "button2" : "button1"}
        textAlign="center"
        color={
          disabled
            ? theme.colors.semanticExtensions.content.contentStateDisabled
            : variant === "text-btn"
            ? theme.colors.semantic.content.contentPrimary
            : variant === "secondary"
            ? theme.colors.semantic.content.contentPrimary
            : theme.colors.semantic.content.contentPrimary
        }
      >
        {title}
      </AppText>
    </ButtonWrapper>
  );
};

export default AppButton;
