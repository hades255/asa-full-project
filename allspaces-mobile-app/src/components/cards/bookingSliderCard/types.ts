import { ImageSource } from "expo-image";

export type T_UPCOMING_BOOKING_ITEM = {
  key: string;
  title: string;
  bgImg: ImageSource;
  price: string;
  description: string;
  reviews: number;
  totalReviewsCount: number;
  duration: string;
};

export type T_UPCOMING_BOOKING_CARD = {
  bookingItem: any;
};
