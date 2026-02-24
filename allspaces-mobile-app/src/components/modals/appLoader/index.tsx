import { Text, Modal, View, ActivityIndicator } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { styles } from "./styles";
import { appColors, moderateScale } from "@/theme";

const AppLoader = ({ visible = false }: { visible?: boolean }) => {
  const { appLoading } = useSelector((state: RootState) => state.appSlice);
  return (
    <Modal visible={appLoading || visible} transparent animationType="fade">
      <View style={styles.mainContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={"small"}
            color={appColors.semantic.content.contentPrimary}
          />
          <Text style={styles.message}>{`Please wait...`}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default AppLoader;
