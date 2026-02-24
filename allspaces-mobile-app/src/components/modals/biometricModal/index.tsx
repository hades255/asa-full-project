import { Modal, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "@/components/appButton";
import { actionSetShowBiometricModal } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";
import AppText from "@/components/appText";
import useBiometric from "@/hooks/useBiometric";
import { SecureStoreService } from "@/config/secureStore";

const BiometricModal = () => {
  const { theme } = useUnistyles();
  const { showBiometricModal } = useSelector(
    (state: RootState) => state.appSlice
  );
  const { toggleBiometric, refreshBiometricState } = useBiometric();
  const dispatch = useDispatch();

  const closeModal = async () => {
    dispatch(actionSetShowBiometricModal(false));
    // Refresh biometric state after closing modal
    await refreshBiometricState();
  };

  return (
    <Modal visible={showBiometricModal} transparent animationType="fade">
      <View style={styles.mainContainer}>
        <View style={styles.middleContainer}>
          <MaterialCommunityIcons
            name="face-recognition"
            size={100}
            color={theme.colors.semanticExtensions.content.contentAccent}
          />
          <View style={styles.contentContainer}>
            <AppText font="heading2" textAlign="center">
              {`Do you want to enable Biometric?`}
            </AppText>
            <AppText
              font="body1"
              color={theme.colors.semantic.content.contentInverseTertionary}
              textAlign="center"
            >
              {`You can enable biometric now for instant login. You can do it later via settings.`}
            </AppText>
          </View>

          <View style={styles.buttonsContainer}>
            <AppButton
              width={138}
              title={`Do it later`}
              onPress={async () => {
                await SecureStoreService.saveValue("BIOMETRIC_ASKED", "true");
                await closeModal();
              }}
              variant="secondary"
            />
            <AppButton
              width={138}
              title={`Setup`}
              onPress={async () => {
                await toggleBiometric(true);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BiometricModal;
