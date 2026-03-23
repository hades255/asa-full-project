import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { T_APP_PHONE_INPUT } from "./types";
import { styles } from "./styles";
import { Controller } from "react-hook-form";
import { useUnistyles } from "react-native-unistyles";
import AppText from "../appText";
import {
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useLocales } from "expo-localization";
import * as ExpoLocation from "expo-location";

const DEFAULT_COUNTRY_CODE: CountryCode = "GB";
const DEFAULT_CALLING_CODE = "44";
/** Clerk test phone numbers: +1555555XXX where XXX is 101–199 */
const CLERK_TEST_NUMBER_REGEX = /^\+1555555(1(0[1-9]|[1-9][0-9]))$/;

// import { PhoneInput, PhoneInputRef } from "rn-phone-input-field";
import PhoneInput, {
  Country,
  PhoneInputRefType,
} from "@linhnguyen96114/react-native-phone-input";

const AppPhoneInput: React.FC<T_APP_PHONE_INPUT> = ({
  control,
  name,
  placeholder,
  label,
  width,
  error,
  onChangeText,
  onCountryResolved,
}) => {
  // NEW PHONE INPUT
  const phoneInputRef = useRef<PhoneInputRefType>(null);
  const hasResolvedCountry = useRef(false);
  const hasUserSelectedCountry = useRef(false);
  const hasCalledCountryResolved = useRef(false);
  const onCountryResolvedRef = useRef(onCountryResolved);
  // const phoneInputRef = useRef<PhoneInputRef>(null);
  const [callingCode, setCallingCode] = useState<string>(DEFAULT_CALLING_CODE);
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY_CODE);
  const { theme } = useUnistyles();
  const locales = useLocales();

  // Update ref when callback changes
  useEffect(() => {
    onCountryResolvedRef.current = onCountryResolved;
  }, [onCountryResolved]);

  const applyCountry = (region: CountryCode) => {
    let callCode = DEFAULT_CALLING_CODE;
    try {
      callCode = getCountryCallingCode(region);
    } catch {
      callCode = DEFAULT_CALLING_CODE;
    }
    setCallingCode(callCode);
    setCountryCode(region);
  };

  const callCountryResolved = () => {
    if (!hasCalledCountryResolved.current) {
      hasCalledCountryResolved.current = true;
      onCountryResolvedRef.current?.();
    }
  };

  useEffect(() => {
    if (hasResolvedCountry.current) return;
    const detectedRegion =
      (locales?.[0]?.regionCode as CountryCode | undefined) ||
      DEFAULT_COUNTRY_CODE;
    applyCountry(detectedRegion);
    hasResolvedCountry.current = true;
    // Call resolved callback immediately after locale detection
    callCountryResolved();
  }, [locales]);

  useEffect(() => {
    let isMounted = true;
    const detectFromGPS = async () => {
      try {
        const permission = await ExpoLocation.getForegroundPermissionsAsync();
        let status = permission.status;
        if (status !== "granted") {
          const request = await ExpoLocation.requestForegroundPermissionsAsync();
          status = request.status;
        }
        if (status !== "granted") {
          callCountryResolved();
          return;
        }

        const position = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });
        const reverse = await ExpoLocation.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const iso = reverse?.[0]?.isoCountryCode as CountryCode | undefined;
        if (!iso) {
          callCountryResolved();
          return;
        }

        if (isMounted && !hasUserSelectedCountry.current) {
          applyCountry(iso);
          hasResolvedCountry.current = true;
        }
      } catch {
        // Ignore GPS errors; fallback to locale/default
      } finally {
        callCountryResolved();
      }
    };

    // Only run GPS detection if country hasn't been resolved yet
    if (!hasCalledCountryResolved.current) {
      detectFromGPS();
    }
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

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
            key={countryCode} // Force re-render when country code changes
            ref={phoneInputRef}
            placeholder={placeholder}
            defaultValue={value}
            defaultCode={countryCode.toUpperCase()}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "");
              if (!digits) {
                onChange("");
                onChangeText(false);
                return;
              }
              const normalizedDigits = digits.startsWith(callingCode)
                ? digits
                : `${callingCode}${digits}`;
              const formattedNumber = `+${normalizedDigits}`;
              onChange(formattedNumber);
              const parsed = parsePhoneNumberFromString(formattedNumber);
              const isValid =
                CLERK_TEST_NUMBER_REGEX.test(formattedNumber) ||
                parsed?.isValid() ||
                phoneInputRef.current?.isValidNumber(text) ||
                false;

              onChangeText(!!isValid);
            }}
            onChangeCountry={(country: Country) => {
              // Update calling code when country changes
              const newCallingCode = Array.isArray(country.callingCode)
                ? country.callingCode[0]
                : country.callingCode;
              setCallingCode(newCallingCode);
              hasUserSelectedCountry.current = true;
              const nextCountryCode =
                ((country as any).code ||
                  (country as any).cca2 ||
                  (country as any).countryCode ||
                  DEFAULT_COUNTRY_CODE) as CountryCode;
              setCountryCode(nextCountryCode);
            }}
            withMask
            containerStyle={styles.phoneInputContainer}
            textInputStyle={styles.phoneInputStyle}
            codeTextStyle={styles.codeTextStyle}
          />
        )}
      />


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
