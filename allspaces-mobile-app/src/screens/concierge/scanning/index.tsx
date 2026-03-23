import { View, Text, Linking, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { T_SCANNING_SCREEN } from "./types";
import { appColors, globalStyles, moderateScale } from "@/theme";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { styles } from "./styles";
import { AppButton, IconButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { gotoScanDetailsFromScanning } from "@/navigation/service";
import { LoginCurve } from "iconsax-react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SecureStoreService } from "@/config/secureStore";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "@/redux/hooks";
import { actionSetCompleteProfile } from "@/redux/app.slice";

const Scanning: React.FC<T_SCANNING_SCREEN> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { isLoaded, signOut } = useAuth();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={[
          globalStyles.mainContainer,
          styles.bodyContainer,
          globalStyles.screenPadding,
          globalStyles.rowGap32,
        ]}
      >
        <Text style={styles.message}>
          {`Ooops! It seems you didn't have camera permission. Please allow camera permission to scan the QR code.`}
        </Text>
        <AppButton
          title={`Grant Permission`}
          onPress={() => Linking.openSettings()}
        />
      </View>
    );
  }

  const onSignoutClick = async () => {
    if (!isLoaded) return;
    // Reset completeProfile state on logout
    dispatch(actionSetCompleteProfile(false));
    await SecureStoreService.deleteValue("SESSION_ID");
    await signOut();
  };

  return (
    <View style={globalStyles.mainContainer}>
      {isFocused && (
        <CameraView
          style={styles.cameraView}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(result: BarcodeScanningResult) => {
            gotoScanDetailsFromScanning(navigation, { scanResult: result });
          }}
          facing={"back"}
        >
          <View style={[styles.logoutContainer]}>
            <IconButton
              icon={
                <LoginCurve
                  size={moderateScale(24)}
                  color={appColors.semanticExtensions.content.contentNegative}
                />
              }
              onPress={onSignoutClick}
            />
          </View>
          <View style={styles.qrPlaceholderView}>
            <Ionicons
              name="scan-outline"
              size={Dimensions.get("window").width * 0.9}
              color={appColors.semantic.content.contentInversePrimary}
            />
          </View>
        </CameraView>
      )}
    </View>
  );
};

export default Scanning;
