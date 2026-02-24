import React from "react";
import { T_HEADER_2 } from "./types";
import { Text, View } from "react-native";

import BackButton from "@/components/backButton";
import { styles } from "./styles";

const Header2: React.FC<T_HEADER_2> = ({ title, renderRight, renderLeft }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>{renderLeft ?? <BackButton />}</View>
      <View style={styles.middleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>{renderRight}</View>
    </View>
  );
};

export default Header2;
