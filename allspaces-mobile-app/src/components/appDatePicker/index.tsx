import { View, Text } from "react-native";
import React, { useState } from "react";
import { T_APP_DATE_PICKER } from "./types";
import { styles } from "./styles";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import ButtonWrapper from "../buttonWrapper";
import { Calendar2, Clock } from "iconsax-react-native";
import { Controller } from "react-hook-form";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";

const AppDatePicker = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder = "Select Date",
  mode = "date",
  width,
  disabled = false,
}: T_APP_DATE_PICKER<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const { theme } = useUnistyles();

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
        render={({ field: { onChange, value, onBlur } }) => {
          const formatValue = (date: Date | string | undefined) => {
            if (!date) return null;
            
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            
            switch (mode) {
              case "time":
                return moment(dateObj).format("hh:mm A");
              case "datetime":
                return moment(dateObj).format("MM/DD/YYYY hh:mm A");
              case "date":
              default:
                return moment(dateObj).format("MM/DD/YYYY");
            }
          };

          const displayValue = value ? formatValue(value) : null;
          const hasValue = Boolean(value);

          return (
            <>
              <DatePicker
                modal
                open={open}
                date={value ? (typeof value === 'string' ? new Date(value) : value) : new Date()}
                mode={mode}
                onConfirm={(tempDate) => {
                  setOpen(false);
                  onChange(tempDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />

              <ButtonWrapper
                onPress={() => {
                  if (!disabled) {
                    setOpen(!open);
                  }
                }}
                otherProps={{
                  style: [
                    styles.inputContainer,
                    disabled && {
                      backgroundColor: theme.colors.semanticExtensions.background.backgroundStateDisabled,
                      opacity: 0.6,
                    },
                  ],
                }}
              >
                {mode === "time" ? (
                  <Clock
                    size={24}
                    color={
                      disabled
                        ? theme.colors.semanticExtensions.content.contentStateDisabled
                        : theme.colors.semantic.content.contentPrimary
                    }
                  />
                ) : (
                  <Calendar2
                    size={24}
                    color={
                      disabled
                        ? theme.colors.semanticExtensions.content.contentStateDisabled
                        : theme.colors.semantic.content.contentPrimary
                    }
                  />
                )}
                <Text
                  style={[
                    styles.input,
                    !hasValue && {
                      color: theme.colors.semantic.content.contentInverseTertionary,
                    },
                    disabled && {
                      color: theme.colors.semanticExtensions.content.contentStateDisabled,
                    },
                  ]}
                >
                  {displayValue || placeholder}
                </Text>
              </ButtonWrapper>
            </>
          );
        }}
      />
    </View>
  );
};

export default AppDatePicker;
