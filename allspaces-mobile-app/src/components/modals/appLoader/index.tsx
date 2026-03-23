import { Text, Modal, View, ActivityIndicator } from "react-native";
import React from "react";
import { useSelector } from "@/redux/hooks";
import { styles } from "./styles";
import { appColors, moderateScale } from "@/theme";
import { selectAppLoading } from "@/redux/selectors";

const AppLoader = ({ visible = false }: { visible?: boolean }) => {
  const appLoading = useSelector(selectAppLoading);
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
