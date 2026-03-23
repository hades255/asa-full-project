export type T_BOOKING_CARD_WITH_REVIEWS = {
  item: T_PROFILE_ITEM;
  onPress: () => void;
  date?: string;
  showQrCode?: boolean;
  showStatus?: boolean;
  onWishClick?: () => void;
  status?: string;
  booking?: boolean;
  price?: number;
};

export type T_PROFILE_FACILITY = {
  id: string;
  name: string;
  description: string;
};

export type T_PROFILE_SERVICE = {
  id: string;
  name: string;
  description: string;
  minSpend: number;
  subCategoryId: string;
  categoryId: string;
  media: string;
};

export type T_PROFILE_MEDIA = {
  id: string;
  url: string;
};

export type T_WISHLIST_ITEM = {
  id: string;
  userId: string;
  profileId: string;
  createdAt: string;
  profile: T_PROFILE_ITEM;
};

export type T_PROFILE_ITEM = {
  id: string;
  name: string;
  description: string;
  email: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  coverMedia: string;
  source: string;
  averageRating: number;
  totalReviews: number;
  rating: {
    oneStarCount: number;
    twoStarCount: number;
    threeStarCount: number;
    fourStarCount: number;
    fiveStarCount: number;
  };
  facilities: T_PROFILE_FACILITY[];
  services: T_PROFILE_SERVICE[];
  reviews: [];
  media: T_PROFILE_MEDIA[];
  isInWishlist: boolean;
  status?: string;
  price?: number;
  matchScore?: number;
};
