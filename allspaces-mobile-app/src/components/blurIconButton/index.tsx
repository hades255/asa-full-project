import React from "react";
import { T_BLUR_ICON_BUTTON } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { styles } from "./styles";
import { BlurView } from "expo-blur";

const BlurIconButton: React.FC<T_BLUR_ICON_BUTTON> = ({ icon, onPress }) => {
  return (
    <ButtonWrapper onPress={onPress}>
      <BlurView tint="light" intensity={4} style={styles.mainContainer}>
        {icon}
      </BlurView>
    </ButtonWrapper>
  );
};

export default BlurIconButton;
