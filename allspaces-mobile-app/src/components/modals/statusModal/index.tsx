import { Text, Modal, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { styles } from "./styles";
import { appColors, horizontalScale, moderateScale } from "@/theme";
import {
  CloseCircle,
  Danger,
  InfoCircle,
  TickCircle,
} from "iconsax-react-native";
import AppButton from "@/components/appButton";
import { actionSetShowStatusModal } from "@/redux/app.slice";

const StatusModal = () => {
  const {
    showStatusModal,
    statusModal,
    statusModalMessage,
    statusModalConfirmPress,
  } = useSelector((state: RootState) => state.appSlice);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(
      actionSetShowStatusModal({
        showStatusModal: false,
        statusModalMessage: "",
        type: "success",
      })
    );
  };

  let title = "";
  switch (statusModal) {
    case "success":
      title = "Success";
      break;
    case "error":
      title = "Error";
      break;
    case "warning":
      title = "Warning";
      break;
    case "confirm":
      title = "Are you sure?";
      break;
    default:
      title = "Success";
      break;
  }

  let icon = null;
  switch (statusModal) {
    case "success":
      icon = (
        <TickCircle
          size={moderateScale(100)}
          color={appColors.semanticExtensions.content.contentPositive}
        />
      );
      break;
    case "error":
      icon = (
        <CloseCircle
          size={moderateScale(100)}
          color={appColors.semanticExtensions.content.contentNegative}
        />
      );
      break;
    case "warning":
      icon = (
        <InfoCircle
          size={moderateScale(100)}
          color={appColors.semanticExtensions.content.contentWarning}
        />
      );
      break;
    case "confirm":
      icon = (
        <Danger
          size={moderateScale(100)}
          color={appColors.semantic.content.contentPrimary}
        />
      );
      break;
    default:
      icon = (
        <TickCircle
          size={moderateScale(100)}
          color={appColors.semanticExtensions.content.contentPositive}
        />
      );
      break;
  }

  return (
    <Modal visible={showStatusModal} transparent animationType="fade">
      <View style={styles.mainContainer}>
        <View style={styles.middleContainer}>
          {icon}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{statusModalMessage}</Text>
          </View>
          {statusModal === "confirm" ? (
            <View style={styles.buttonsContainer}>
              <AppButton
                width={horizontalScale(138)}
                title={`Cancel`}
                onPress={closeModal}
                variant="secondary"
              />
              <AppButton
                width={horizontalScale(138)}
                title={`Confirm`}
                onPress={(e) => {
                  if (statusModalConfirmPress) statusModalConfirmPress(e);
                  closeModal();
                }}
              />
            </View>
          ) : (
            <AppButton
              width={horizontalScale(234)}
              title={`Okay`}
              onPress={closeModal}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
