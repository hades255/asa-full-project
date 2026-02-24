import { T_WISHLIST_PROFILE } from "@/screens/favourites/types";

export type T_WISHLIST_CARD = {
  bookingItem: T_WISHLIST_PROFILE;
  showStatus?: boolean;
  showQrCode?: boolean;
  onPress: () => void;
  handleRemoveFromWishlist: () => void;
};
