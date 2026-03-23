import React from "react";
import { T_CHOOSE_LOCATION_SCREEN } from "./types";
import {
  AppButton,
  GooglePlacesInput,
  Header2,
  ScreenWrapper,
  Spacer,
} from "@/components";
import { View } from "react-native";
import { styles } from "./styles";
import { useSelector } from "@/redux/hooks";
import { selectGooglePlaceData } from "@/redux/selectors";

const ChooseLocation = ({}) => {
  const googlePlaceData = useSelector(selectGooglePlaceData);

  return (
    <ScreenWrapper>
      {/* <Header2 title="Choose Location" /> */}
      <View
        // showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
      >
        <GooglePlacesInput label="Where" placeholder={`Search location...`} />
        <Spacer flex />
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
