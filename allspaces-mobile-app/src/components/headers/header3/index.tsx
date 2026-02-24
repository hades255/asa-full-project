import React from "react";
import { T_HEADER_3 } from "./types";
import { styles } from "./styles";
import { Text, View } from "react-native";

const Header3: React.FC<T_HEADER_3> = ({ renderRight, title }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.middleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>{renderRight}</View>
    </View>
  );
};

export default Header3;
