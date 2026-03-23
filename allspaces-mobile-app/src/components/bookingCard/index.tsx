import { View } from "react-native";
import React, { memo } from "react";
import { T_BOOKING_CARD } from "./types";
import { styles } from "./styles";
import { Image } from "expo-image";
import AppText from "../appText";
import { StarIcon } from "assets/icons";
import { Location, Scan } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import BlurIconButton from "../blurIconButton";
import ButtonWrapper from "../buttonWrapper";
import { LinearGradient } from "expo-linear-gradient";
import QrModal from "../modals/qrModal";

const BookingCard: React.FC<T_BOOKING_CARD> = ({
  booking,
  onPress,
  onScanPress,
}) => {
  const { theme } = useUnistyles();
  return (
    <ButtonWrapper
      onPress={onPress}
      otherProps={{
        style: styles.mainContainer,
      }}
    >
      <QrModal />
      <View style={styles.fullWidth}>
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
          style={styles.fullLinearGrad}
        />
        <Image
          source={{
            uri: booking.profile.coverMedia,
          }}
          contentFit="cover"
          style={styles.fullWidthImageStyle}
        />
        <View style={styles.iconsContainer}>
          <BlurIconButton
            icon={
              <Scan
                size={24}
                color={theme.colors.semantic.content.contentInversePrimary}
                onPress={onScanPress}
              />
            }
          />
        </View>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor:
                booking.status == "PENDING"
                  ? theme.colors.semanticExtensions.background.backgroundWarning
                  : booking.status == "APPROVED"
                  ? theme.colors.semanticExtensions.background.backgroundAccent
                  : booking.status == "COMPLETED"
                  ? theme.colors.semantic.background.backgroundInversePrimary
                  : theme.colors.semanticExtensions.background
                      .backgroundNegative,
            },
          ]}
        >
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInversePrimary}
          >
            {booking.status}
          </AppText>
        </View>
      </View>
      <View style={styles.fullContentContainer}>
        <View style={styles.contentHeadRow}>
          <AppText
            font="button1"
            textProps={{ numberOfLines: 1 }}
            style={{ flex: 1 }}
          >
            {booking.profile.name}
          </AppText>
          <View style={styles.rightAlignRow}>
            <StarIcon
              width={15}
              height={15}
              color={theme.colors.semanticExtensions.content.contentAccent}
            />
            <AppText font="body2">
              {booking.profile.averageRating.toFixed(1)}
            </AppText>
            <AppText font="body2">{`(${booking.profile.totalReviews})`}</AppText>
          </View>
        </View>
        <View style={styles.leftAlignRow}>
          <Location
            size={16}
            color={theme.colors.semantic.content.contentInverseTertionary}
          />
          <AppText
            font="body2"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >
            {booking.address}
          </AppText>
        </View>
        <AppText font="body1">{`£ ${booking.amount.toFixed(
          2
        )} min.spend`}</AppText>
      </View>
    </ButtonWrapper>
  );
};

export default memo(BookingCard);
