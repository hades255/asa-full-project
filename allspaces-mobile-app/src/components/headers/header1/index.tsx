import React from "react";
import { T_HEADER_1 } from "./types";
import { styles } from "./styles";
import { Text, View } from "react-native";
import IconButton from "@/components/iconButton";
import { HambergerMenu } from "iconsax-react-native";
import { appColors, moderateScale } from "@/theme";
import { useNavigation } from "@react-navigation/native";

const Header1: React.FC<T_HEADER_1> = ({ renderRight, title }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <IconButton
          onPress={() => {
            // @ts-ignore
            navigation.toggleDrawer();
          }}
          icon={
            <HambergerMenu
              size={moderateScale(24)}
              color={appColors.semantic.content.contentPrimary}
            />
          }
        />
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>{renderRight}</View>
    </View>
  );
};

export default Header1;
