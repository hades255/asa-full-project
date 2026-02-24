import React from "react";
import { T_ICON_BUTTON } from "./types";
import ButtonWrapper from "../buttonWrapper";
import { styles } from "./styles";

const IconButton: React.FC<T_ICON_BUTTON> = ({ icon, onPress }) => {
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      {icon}
    </ButtonWrapper>
  );
};

export default IconButton;
