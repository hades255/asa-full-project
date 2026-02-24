import React from "react";
import { T_CHOOSE_LOCATION_SCREEN } from "./types";
import {
  AppButton,
  GooglePlacesInput,
  Header2,
  ScreenWrapper,
} from "@/components";
import { View } from "react-native";
import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ChooseLocation = ({}) => {
  const { googlePlaceData } = useSelector((state: RootState) => state.appSlice);

  return (
    <ScreenWrapper>
      {/* <Header2 title="Choose Location" /> */}
      <View
        // showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
      >
        <GooglePlacesInput label="Where" placeholder={`Search location...`} />
        <View style={{ flex: 1 }} />
        <AppButton
          disabled={!googlePlaceData}
          title="Confirm Location"
          onPress={() => {
            if (!googlePlaceData || !googlePlaceData.structured_formatting)
              return;
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ChooseLocation;
