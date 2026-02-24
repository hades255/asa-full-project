import React from "react";
import { T_HEADER_HOME } from "./types";
import { styles } from "./styles";
import { View } from "react-native";
import IconButton from "@/components/iconButton";
import { ArrowDown2, Gps, HambergerMenu } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import AppText from "@/components/appText";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HeaderHome: React.FC<T_HEADER_HOME> = ({}) => {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const { userLocation } = useSelector((state: RootState) => state.appSlice);

  return (
    <View style={styles.mainContainer}>
      <IconButton
        onPress={() => {
          // @ts-ignore
          navigation.toggleDrawer();
        }}
        icon={
          <HambergerMenu
            size={24}
            color={theme.colors.semantic.content.contentPrimary}
          />
        }
      />
      <View style={styles.locationContainer}>
        <View style={styles.row}>
          <Gps
            size={16}
            color={theme.colors.semantic.content.contentInverseTertionary}
          />
          <AppText
            font="body2"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Current Location`}</AppText>
        </View>
        <View style={styles.row}>
          <AppText
            font={"button1"}
            textProps={{
              numberOfLines: 1,
            }}
            style={{ flex: 1 }}
          >{`${userLocation?.results[0].formatted_address}`}</AppText>
          <ArrowDown2
            size={20}
            color={theme.colors.semantic.content.contentPrimary}
          />
        </View>
      </View>
    </View>
  );
};

export default HeaderHome;
