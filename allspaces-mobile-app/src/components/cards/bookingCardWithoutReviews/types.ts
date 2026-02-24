import { ImageSourcePropType } from "react-native";

export type T_UPCOMING_BOOKING_ITEM = {
  key: string;
  title: string;
  bgImg: ImageSourcePropType;
  price: string;
  description: string;
  status?: string;
  reviews: number;
  totalReviewsCount: number;
  duration: string;
};

export type T_UPCOMING_BOOKING_CARD = {
  bookingItem: T_UPCOMING_BOOKING_ITEM;
  showQrCode?: boolean;
  showStatus?: boolean;
  onPress: () => void;
};
