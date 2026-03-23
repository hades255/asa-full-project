import { View } from "react-native";
import React from "react";
import { T_EMPTY_LIST } from "./types";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import { SearchStatus } from "iconsax-react-native";

const EmptyList: React.FC<T_EMPTY_LIST> = ({ message, icon }) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.iconContainer}>
        {icon ?? (
          <SearchStatus
            size={40}
            color={theme.colors.semantic.content.contentInverseTertionary}
          />
        )}
      </View>
      <AppText
        font="body1"
        textAlign="center"
        color={theme.colors.semantic.content.contentInverseTertionary}
      >
        {message}
      </AppText>
    </View>
  );
};

export default EmptyList;
