import { View } from "react-native";
import React from "react";
import { T_PREF_CARD } from "./types";
import ButtonWrapper from "@/components/buttonWrapper";
import { styles } from "./styles";

import AppText from "@/components/appText";
import { useUnistyles } from "react-native-unistyles";
import { Image } from "expo-image";
import { Star1 } from "iconsax-react-native";

const PrefCard: React.FC<T_PREF_CARD> = ({
  prefItem,
  selectedPrefItems,
  onPrefCardPress,
}) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: prefItem.icon }}
            contentFit="contain"
            style={styles.iconStyle}
          />
        </View>
        <AppText font="button1">{prefItem.title}</AppText>
      </View>
      <View style={styles.wrapContainer}>
        {prefItem.subPreferences.map((subPref) => {
          const isSelected = selectedPrefItems.find(
            (item) => item === subPref.id
          );
          return (
            <ButtonWrapper
              key={subPref.id}
              onPress={() => {
                onPrefCardPress(subPref);
              }}
              otherProps={{
                style: [
                  styles.chipContainer,
                  {
                    backgroundColor: !isSelected
                      ? theme.colors.semantic.background.backgroundSecondary
                      : theme.colors.semanticExtensions.background
                          .backgroundAccent,
                  },
                ],
              }}
            >
              {subPref.title === "Budget" ? (
                <Star1
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              ) : subPref.title === "Basic" ? (
                <View style={{ flexDirection: "row" }}>
                  {Array(2)
                    .fill("1")
                    .map((item, index) => (
                      <Star1
                        key={index.toString()}
                        size={24}
                        color={theme.colors.semantic.content.contentPrimary}
                      />
                    ))}
                </View>
              ) : subPref.title === "Standard" ? (
                <View style={{ flexDirection: "row" }}>
                  {Array(3)
                    .fill("1")
                    .map((item, index) => (
                      <Star1
                        key={index.toString()}
                        size={24}
                        color={theme.colors.semantic.content.contentPrimary}
                      />
                    ))}
                </View>
              ) : subPref.title === "Stylish" ? (
                <View style={{ flexDirection: "row" }}>
                  {Array(4)
                    .fill("1")
                    .map((item, index) => (
                      <Star1
                        key={index.toString()}
                        size={24}
                        color={theme.colors.semantic.content.contentPrimary}
                      />
                    ))}
                </View>
              ) : subPref.title === "Premium" ? (
                <View style={{ flexDirection: "row" }}>
                  {Array(5)
                    .fill("1")
                    .map((item, index) => (
                      <Star1
                        key={index.toString()}
                        size={24}
                        color={theme.colors.semantic.content.contentPrimary}
                      />
                    ))}
                </View>
              ) : subPref.title === "Luxury" ? (
                <View style={{ flexDirection: "row" }}>
                  {Array(6)
                    .fill("1")
                    .map((item, index) => (
                      <Star1
                        key={index.toString()}
                        size={24}
                        color={theme.colors.semantic.content.contentPrimary}
                      />
                    ))}
                </View>
              ) : (
                <Image
                  source={{ uri: subPref.icon }}
                  contentFit="contain"
                  style={styles.iconStyle}
                />
              )}
              <AppText
                font="caption1"
                color={theme.colors.semantic.content.contentPrimary}
              >
                {subPref.title}
              </AppText>
            </ButtonWrapper>
          );
        })}
      </View>
    </View>
  );
};

export default PrefCard;
