import { View, Modal } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { styles } from "./styles";
import QRCode from "react-native-qrcode-svg";
import { useUnistyles } from "react-native-unistyles";
import AppButton from "@/components/appButton";
import { actionSetShowQRModal } from "@/redux/app.slice";

const QrModal = () => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { showQrModal, bookingId } = useSelector(
    (state: RootState) => state.appSlice
  );

  if (!bookingId) return;

  const closeModal = () => {
    dispatch(actionSetShowQRModal(false));
  };

  return (
    <Modal visible={showQrModal} transparent animationType="fade">
      <View style={styles.mainContainer}>
        <View style={styles.middleContainer}>
          <QRCode
            color={theme.colors.semantic.content.contentPrimary}
            size={124}
            value={bookingId}
          />
          <AppButton width={234} title={`Close`} onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

export default QrModal;
