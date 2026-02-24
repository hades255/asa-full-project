import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./styles";
import { T_APP_DROPDOWN_PICKER } from "./types";
import AppText from "../appText";
import ButtonWrapper from "../buttonWrapper";
import { useUnistyles } from "react-native-unistyles";
import { ArrowDown2 } from "iconsax-react-native";
import { Controller } from "react-hook-form";

const AppDropdownPicker: React.FC<T_APP_DROPDOWN_PICKER> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  icon,
  name,
  control,
}) => {
  const { theme } = useUnistyles();
  const [isPickerVisible, setIsPickerVisible] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleOptionSelect = (option: { label: string; value: string }) => {
          onChange(option.value);
          onValueChange(option.value);
          setIsPickerVisible(false);
        };

        const getSelectedLabel = () => {
          const selectedOption = options.find(option => option.value === value);
          return selectedOption ? selectedOption.label : value || "";
        };

        return (
          <View style={styles.mainContainer}>
            {label && (
              <View style={styles.labelContainer}>
                <AppText font="button1">{label}</AppText>
              </View>
            )}
            
            <ButtonWrapper
              onPress={() => setIsPickerVisible(!isPickerVisible)}
              otherProps={{
                style: styles.inputContainer,
              }}
            >
              <View style={styles.inputLeft}>
                {icon}
                <AppText font="body1" style={styles.selectedText}>
                  {getSelectedLabel()}
                </AppText>
              </View>
              <ArrowDown2
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
                style={[
                  styles.arrowIcon,
                  isPickerVisible && styles.arrowIconRotated
                ]}
              />
            </ButtonWrapper>

            {isPickerVisible && (
              <View style={styles.optionsContainer}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  style={styles.optionsScrollView}
                >
                  {options.map((item, index) => (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => handleOptionSelect(item)}
                      activeOpacity={0.7}
                      style={[
                        styles.optionItem,
                        index === options.length - 1 && styles.lastOptionItem,
                        item.value === value && styles.selectedOptionItem
                      ]}
                    >
                      <AppText 
                        font="body2" 
                        style={[
                          styles.optionText,
                          item.value === value && styles.selectedOptionText
                        ]}
                      >
                        {item.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

export default AppDropdownPicker;
