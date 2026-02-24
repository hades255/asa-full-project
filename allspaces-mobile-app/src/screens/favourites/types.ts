import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";
import { FavouritesStackParamList } from "@/navigation/favouritesStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_FAVOURITES_SCREEN = NativeStackScreenProps<
  FavouritesStackParamList,
  "FavouritesScreen"
>;
export type T_FAVOURITES_SCREEN_ROUTE_PARAMS = undefined;

export type T_WISHLIST_ITEM = {
  id: string;
  profile: T_PROFILE_ITEM;
};

export type T_WISHLIST_PROFILE = {
  coverMedia: string | null;
  createdAt: string;
  description: string;
  email: string;
  id: string;
  location: string;
  source: string;
  name: string;
  status: string;
  updatedAt: string;
  userId: string;
};
