import { View, Text, Modal, FlatList, TextInput } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { T_COUNTRY_ITEM, T_COUNTRY_PICKER_MODAL } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";
import ScreenWrapper from "@/components/screenWrapper";
import { CountriesJson } from "assets/json";
import { CloseCircle } from "iconsax-react-native";
import CountryPickerItem from "./country.picker.item";
import { useUnistyles } from "react-native-unistyles";
import AppText from "@/components/appText";

const CountryPickerModal: React.FC<T_COUNTRY_PICKER_MODAL> = ({
  visible,
  onCountrySelect,
  onRequestClose,
  selectedCountry,
}) => {
  const { theme } = useUnistyles();
  const [countries, setCountries] = useState<T_COUNTRY_ITEM[]>(CountriesJson);
  const [searchedCountries, setSearchedCountries] =
    useState<T_COUNTRY_ITEM[]>(CountriesJson);

  const [search, setSearch] = useState<string>("");

  const searchInputHandler = useCallback((searchValue: string) => {
    setSearch(searchValue);

    if (searchValue.length) {
      setSearchedCountries(
        countries.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [countries]);

  const data = useMemo(
    () => (search.length ? searchedCountries : CountriesJson),
    [search.length, searchedCountries]
  );

  const keyExtractor = useCallback((item: T_COUNTRY_ITEM) => item.code, []);

  const renderItem = useCallback(
    ({ item }: { item: T_COUNTRY_ITEM }) => (
      <CountryPickerItem
        country={item}
        isSelected={item.code === selectedCountry?.code}
        onSelectCountry={onCountrySelect}
      />
    ),
    [onCountrySelect, selectedCountry?.code]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <ScreenWrapper>
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            <AppText font="heading2">{`Select Country`}</AppText>
            <ButtonWrapper onPress={onRequestClose}>
              <CloseCircle
                size={32}
                color={theme.colors.semantic.content.contentPrimary}
              />
            </ButtonWrapper>
          </View>
          <TextInput
            placeholder="Search"
            placeholderTextColor={
              theme.colors.semantic.content.contentInverseTertionary
            }
            autoCapitalize="none"
            textAlignVertical="center"
            verticalAlign="middle"
            value={search}
            onChangeText={searchInputHandler}
            style={styles.searchInput}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
          />
        </View>
      </ScreenWrapper>
    </Modal>
  );
};

export default CountryPickerModal;
