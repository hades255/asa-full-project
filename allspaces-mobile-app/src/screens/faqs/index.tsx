import React, { useState } from "react";
import { T_FAQS_SCREEN } from "./types";
import { AppText, Header2, ScreenWrapper } from "@/components";
import Accordion from "react-native-collapsible/Accordion";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { ArrowSquareDown, ArrowSquareRight } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import { useGetFAQsAPI } from "@/apis";

const Faqs: React.FC<T_FAQS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();

  const { data: faqs, isPending, refetch, isRefetching } = useGetFAQsAPI();

  const [activeSections, setActiveSections] = useState<number[] | string[]>([]);

  return (
    <ScreenWrapper>
      <Header2 title="FAQs" />
      {!isPending && faqs ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.core.accent]}
              tintColor={theme.colors.core.accent}
            />
          }
        >
          <Accordion
            sections={faqs}
            activeSections={activeSections}
            sectionContainerStyle={{
              marginBottom: theme.units[4],
            }}
            underlayColor="transparent"
            renderHeader={({ question, id }) => {
              const faqIndex = faqs.findIndex((item) => item.id === id);
              const isActive = activeSections.find((item) => item === faqIndex);

              return (
                <View style={styles.headerContainer}>
                  <AppText width={"90%"} font="body1">
                    {question}
                  </AppText>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {isActive ? (
                      <ArrowSquareDown
                        color={theme.colors.semantic.content.contentPrimary}
                        size={24}
                      />
                    ) : (
                      <ArrowSquareRight
                        color={theme.colors.semantic.content.contentPrimary}
                        size={24}
                      />
                    )}
                  </View>
                </View>
              );
            }}
            renderContent={({ answer }) => (
              <View style={styles.contentContainer}>
                <AppText
                  font="body2"
                  color={theme.colors.semantic.content.contentTertionary}
                >
                  {answer}
                </AppText>
              </View>
            )}
            onChange={setActiveSections}
          />
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={"small"}
            color={theme.colors.semanticExtensions.content.contentAccent}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default Faqs;
