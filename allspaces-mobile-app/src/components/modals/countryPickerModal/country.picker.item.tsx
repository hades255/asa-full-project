import { Text, View } from "react-native";
import React from "react";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";
import { SvgUri } from "react-native-svg";
import { T_COUNTRY_ITEM } from "./types";
import { appColors, moderateScale } from "@/theme";
import { TickCircle } from "iconsax-react-native";

const CountryPickerItem = ({
  country,
  isSelected,
  onSelectCountry,
}: {
  country: T_COUNTRY_ITEM;
  isSelected: boolean;
  onSelectCountry: (country: T_COUNTRY_ITEM) => void;
}) => {
  return (
    <ButtonWrapper
      onPress={() => {
        onSelectCountry(country);
      }}
      otherProps={{
        style: styles.countryItemContainer,
      }}
    >
      <View style={styles.leftContainer}>
        <SvgUri
          uri={country.image}
          width={moderateScale(24)}
          height={moderateScale(24)}
        />
        <Text style={styles.countryName}>{country.name}</Text>
      </View>
      <View style={styles.rightContainer}>
        {isSelected && (
          <TickCircle
            color={appColors.semanticExtensions.content.contentPositive}
            size={moderateScale(24)}
          />
        )}
      </View>
    </ButtonWrapper>
  );
};

export default CountryPickerItem;
