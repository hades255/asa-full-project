import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { T_APP_PHONE_INPUT } from "./types";
import { styles } from "./styles";
import { Controller } from "react-hook-form";
import { useUnistyles } from "react-native-unistyles";
import AppText from "../appText";
import * as Cellular from "expo-cellular";
import { CountryCode } from "libphonenumber-js";

import { PhoneInput, PhoneInputRef } from "rn-phone-input-field";

const AppPhoneInput: React.FC<T_APP_PHONE_INPUT> = ({
  control,
  name,
  placeholder,
  label,
  width,
  error,
  onChangeText,
}) => {
  // NEW PHONE INPUT
  const phoneInputRef = useRef<PhoneInputRef>(null);
  const [callingCode, setCallingCode] = useState<string>("44");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const { theme } = useUnistyles();

  useEffect(() => {
    Cellular.getIsoCountryCodeAsync().then((isoCode) => {
      if (isoCode) {
        setCountryCode(isoCode.toUpperCase() as CountryCode);
        Cellular.getMobileCountryCodeAsync().then((code) => {
          if (code) {
            setCallingCode(code);
          } else {
            setCountryCode("GB");
            setCallingCode("44");
          }
        });
      }
    });
  }, []);

  return (
    <View style={[styles.mainContainer, { width: width ?? "100%" }]}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText font="button1">{label}</AppText>
        </View>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <PhoneInput
            ref={phoneInputRef}
            placeholder={placeholder}
            placeholderColor={
              theme.colors.semantic.content.contentInverseTertionary
            }
            defaultValue={value}
            defaultCountry={countryCode.toUpperCase()}
            onChangeText={(phoneNumber: string) => {
              let formattedNumber = `+${callingCode}${phoneNumber}`;
              onChange(formattedNumber);
              const isValid = phoneInputRef.current?.isValidNumber(phoneNumber);
              onChangeText(isValid);
            }}
            onSelectCountryCode={(country: any) => {
              setCallingCode(country.callingCode);
            }}
            containerStyle={styles.phoneInputContainer}
            textInputStyle={styles.phoneInputStyle}
            codeTextStyle={styles.codeTextStyle}
          />
        )}
      />

      {/* <CountryPickerModal
        visible={showCountryPicker}
        onCountrySelect={(countryItem) => {
          setCountry(countryItem);
          setShowCountryPicker(!showCountryPicker);
        }}
        selectedCountry={country}
        onRequestClose={() => {
          setShowCountryPicker(!showCountryPicker);
        }}
      />
      <Animated.View style={[styles.inputContainer, inputBorderAnimation]}>
        <ButtonWrapper
          onPress={() => {
            setShowCountryPicker(!showCountryPicker);
          }}
          otherProps={{
            // disabled: true,
            style: styles.countryPickerButton,
          }}
        >
          <SvgUri uri={country.image} width={24} height={24} />
          <ArrowDown2
            size={24}
            color={theme.colors.semantic.content.contentPrimary}
          />
        </ButtonWrapper>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={
                theme.colors.semantic.content.contentInverseTertionary
              }
              autoCapitalize="none"
              keyboardType="phone-pad"
              value={value.split(","[0])}
              onFocus={() => {
                borderColor.value = withTiming(
                  value.length == 0 ? 1 : error ? 2 : 3,
                  { duration: 300 }
                );
              }}
              onBlur={() => {
                borderColor.value = withTiming(
                  value.length == 0 ? 0 : error ? 2 : 3,
                  { duration: 300 }
                );
                onBlur();
              }}
              onChangeText={(textValue) => {
                onChange(`${textValue}--${JSON.stringify(country)}`);
                borderColor.value = withTiming(
                  textValue.length == 0 ? 1 : error ? 2 : 3,
                  {
                    duration: 300,
                  }
                );
              }}
              style={[styles.input]}
            />
          )}
        />
      </Animated.View> */}
      {error && (
        <View style={styles.errorContainer}>
          <AppText
            font="caption1"
            color={theme.colors.semanticExtensions.content.contentNegative}
          >
            {error}
          </AppText>
        </View>
      )}
    </View>
  );
};

export default AppPhoneInput;
