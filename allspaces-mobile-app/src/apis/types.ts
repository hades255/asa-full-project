import {
  T_PROFILE_ITEM,
  T_PROFILE_SERVICE,
} from "@/components/cards/bookingCardWithReviews/types";
import { T_WISHLIST_ITEM } from "@/screens/favourites/types";
import { UserResource } from "@clerk/types";

export type T_CREATE_STRIPE_CUSTOMER_BODY = {
  user_id: string;
  email: string;
};

export type T_CREATE_STRIPE_INTENT_BODY = {
  stripe_customer_id: string;
  user_id: string;
};

export type T_UPDATE_PAYMENT_METHOD_BODY = {
  user_id: string;
};

export type T_UPDATE_PAYMENT_METHOD_API = {
  setupIntent: {
    client_secret: string;
  };
  ephemeralKey: string;
  user: {
    stripe_customer_id: string;
  };
};

export type T_CREATE_CUSTOMER_API = {
  clerk_user_id: string;
  created_at: string;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  password: string;
  phone: string | null;
  stripe_customer_id: string;
};

export type T_CREATE_PAYMENT_INTENT_API = {
  setupIntent: {
    setupIntent: string;
    // ephemeralKey: string;
    client_secret: string;
    // publishableKey: string;
  };
  ephemeralKey: string;
  code: number;
  response: string;
};
export type T_FACILITY = {
  id: string;
  name: string;
  description: string;
};

export type T_SERVICE = {
  id: string;
  name: string;
  description: string;
  minSpend: number;
  media: string;
  vendorServiceId: string;
};

export type T_REVIEW = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type T_PROFILE_MEDIA = {
  id: string;
  url: string;
};

export type T_GET_PROFILE_ITEM = {
  id: string;
  name: string;
  description: string;
  email: string;
  location: string;
  coverMedia: string;
  averageRating: number;
  source: string;
  totalReviews: number;
  rating: {
    oneStarCount: number;
    twoStarCount: number;
    threeStarCount: number;
    fourStarCount: number;
    fiveStarCount: number;
  };
  facilities: T_FACILITY[];
  services: T_SERVICE[];
  reviews: T_REVIEW[];
  media: T_PROFILE_MEDIA[];
  isInWishlist: boolean;
};

export type T_FILTER_SUBCATEGORY = {
  id: string;
  title: string;
  image: string;
};
export type T_FILTER_CATEGORY = {
  id: string;
  title: string;
  image: string;
  subcategories: T_FILTER_SUBCATEGORY[];
};

export type T_PROFILE_FILTERS_API = {
  message: string;
  filters: {
    categories: T_FILTER_CATEGORY[];
    location: {
      lat: number;
      lng: number;
    };
    pricing: {
      min: number;
      max: number;
    };
    rating: {
      min: number;
      max: number;
    };
  };
};

export type T_SEARCH_ITEM = T_PROFILE_ITEM | T_ACCOR_ITEM;

export type T_SEARCH_PROFILE_API = {
  data: T_SEARCH_ITEM[];
  pagination: { limit: number; page: number; pages: number; total: number };
  savedSearchId: string;
};

export type T_BOOKING_API = {
  data: T_BOOKING_ITEM[];
  pagination: { limit: number; page: number; pages: number; total: number };
  savedSearchId: string;
};

export type T_CREATE_BOOKING_BODY = {
  profile_id: string;
  check_in: string;
  time: string;
  no_of_guests: number;
};

export type T_SEARCH_FILTERS = {
  page?: number;
  limit?: number;
  categoryIds?: string[];
  location?: { lat: number; lng: number };
};

export type T_SUBMIT_PAYMENT_BODY = {
  profile_id: string;
  check_in: string;
  time: string;
  no_of_guests: number;
  source: string;
};

export type T_SUBMIT_PAYMENT_API = {
  data: {
    paymentIntent: {
      client_secret: string;
    };
    ephemeralKey: string;
    user: {
      stripe_customer_id: string;
    };
  };
};

export type T_CREATE_BOOKING_API = {
  data: any;
};

export type T_GET_WISHLIST_API = {
  data: T_WISHLIST_ITEM[];
};

export type T_GET_PROFILE_API = {
  data: T_GET_PROFILE_ITEM[];
};

export type T_GET_PROFILE_BY_ID_API = {
  data: T_GET_PROFILE_ITEM;
};

export type T_RATE_BOOKING_BODY = {
  bookingId: string;
  profileId: string;
  rating: number;
  comment: string;
};

export type T_RATE_BOOKING_API = {
  data: any;
};

export type T_REGISTER_USER_BODY = {
  clerk_user_id: string;
};

export type T_CONTACT_SUPPORT_BODY = {
  subject: string;
  message: string;
};

export interface ADDRESS_COMPONENT {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GEO_RESULT {
  address_components: ADDRESS_COMPONENT[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}
export type T_GEOCODING_RESPONSE = {
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  results: GEO_RESULT[];
  status: string;
};

export type T_CATEGORY_ITEM = {
  id: string;
  title: string;
  image: string;
  mobileImage?: string;
  type: string;
  parentId: string | null;
};

type T_ADDRESS_COMPONENT = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type T_GEO_RESULT = {
  address_components: T_ADDRESS_COMPONENT[];
  formatted_address: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
};

export type T_GEOCODE_REPONSE = {
  results: T_GEO_RESULT[];
  status: string;
};

export type T_MY_PREF_ITEM = {
  id: string;
  userId: string;
  categoryId: string;
  category: {
    id: string;
    title: string;
    type: string;
    parentId: string;
    parent: {
      id: string;
      title: string;
      image: string;
      type: string;
      parentId: string | null;
    };
  };
};

export type T_BOOKING_SERVICE_ITEM = {
  id: string;
  bookingId: string;
  serviceId: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    description: string;
    minSpend: number;
    media: string;
  };
};

export type T_ORDER_ITEM = {
  id: string;
  bookingId: string;
  check_in: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type T_BOOKNIG_REVIEW = {
  id: string;
  userId: string;
  profileId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

// export type T_BOOKING_ITEM = {
//   id: string;
//   userId: string;
//   amount: number;
//   cancellationReason: string | null;
//   payment_status: "PENDING" | "FAILED" | "COMPLETED";
//   customerId: string;
//   profileId: string;
//   check_in: string;
//   no_of_guests: number;
//   status: string;
//   spend: number;
//   lat: number;
//   lng: number;
//   address: string;
//   isReviewed: boolean;
//   reviews: T_BOOKNIG_REVIEW[];
//   created_at: string;
//   updated_at: string;
//   user: {
//     id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone: string;
//   };
//   profile: T_PROFILE_ITEM;
//   bookingServices: T_PROFILE_SERVICE[];
//   orders: T_ORDER_ITEM[];
//   message: string;
// };

export type T_PREF_ITEM = {
  id: string;
  userId: string;
  categoryId: string;
  category: {
    id: string;
    title: string;
    type: string;
    parentId: string;
    parent: {
      id: string;
      title: string;
      image: string;
      type: string;
      parentId: string | null;
    };
  };
};

export type T_BOOKING_ITEM = {
  id: string;
  userId: string;
  customerId: string;
  profileId: string;
  check_in: string;
  no_of_guests: number;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
  spend: number;
  payment_status: "PENDING" | "COMPLETED" | "FAILED";
  amount: number;
  notes: string | null;
  lat: number;
  lng: number;
  address: string;
  isReviewed: boolean;
  cancellationReason: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email: string;
    password: string;
    confirmed_at: string;
    stripe_customer_id: string | null;
    stripe_payment_id: string | null;
    clerk_user_id: string | null;
    roles: string[];
    status: string;
    refresh_token: string;
    created_at: string;
    updated_at: string;
    parent_id: string | null;
  };
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    clerk_user_id: string;
    clerkCustomerData: any;
    customerPreferences: T_PREF_ITEM[];
    averageRating: number;
    reviewsCount: number;
    reviews: T_REVIEW[];
  };
  profile: T_PROFILE_ITEM;
  bookingServices: T_PROFILE_SERVICE[];
  reviews: T_REVIEW[];
};

export type T_USER = {
  averageRating: number;
  clerk_user_id: string;
  confirmed_at: string | null;
  created_at: string;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
  reviews: T_REVIEW[];
  roles: string[];
  status: string;
  totalReviews: number;
};

export type T_FAQ = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type T_WISHLIST_API = {
  data: T_WISHLIST_ITEM[];
  pagination: { limit: number; page: number; pages: number; total: number };
  savedSearchId: string;
};

export type T_SUB_PREFERENCE_ITEM = {
  id: string;
  title: string;
  icon: string;
  orderIndex: number;
  parentId: string;
};

export type T_PREFERENCES_ITEM = {
  id: string;
  title: string;
  icon: string;
  orderIndex: number;
  subPreferences: T_SUB_PREFERENCE_ITEM[];
};

export type T_GET_PREFERENCES_API = {
  success: true;
  data: T_PREFERENCES_ITEM[];
  message: "All preferences retrieved successfully";
};

export type T_ACCOR_MEDIA = {
  "120x90": string;
  "346x260": string;
};

export type T_PAYMENT_MEANS_ITEM = {
  code: string;
  rank: number;
  name: string;
  family: string;
  types: string[];
  installments: [];
};

export type T_ACCOR_CODE_ITEM = {
  id: string;
  source: string;
};

export type T_ACCOR_ITEM = {
  id: string;
  score: number;
  distance: number;
  hotel: {
    id: string;
    name: string;
    description: string;
    status: string;
    type: string;
    openingDate: string;
    lastRenovationDate: string;
    croCode: string;
    lodging: string;
    brand: string;
    chain: string;
    scale: string;
    currencyCode: string;
    roomOccupancy: {
      maxAdult: number;
      maxChild: number;
      maxChildAge: number;
      maxPax: number;
      maxRoom: number;
    };
    checkin: {
      available: boolean;
    };
    loyaltyProgram: {
      advantageAllowed: boolean;
      burnAllowed: boolean;
      earnAllowed: boolean;
      huazhuRewards: boolean;
      status: string;
      memberRate: boolean;
    };
    label: string[];
    amenity: {
      free: string[];
    };
    media: {
      count: number;
      medias: T_ACCOR_MEDIA[];
    };
    contact: {
      phonePrefix: string;
      phone: string;
      faxPrefix: string;
      fax: string;
      generalManager: {
        firstName: string;
        lastName: string;
      };
    };
    localization: {
      address: {
        street: string;
        line1: string;
        zipCode: string;
        city: string;
        country: string;
        countryCode: string;
      };
      environmentCode: string;
      gps: {
        lng: string;
        lat: string;
      };
      geo: {
        code: string;
        type: string;
      };
    };
    factsheetUrl: string;
    rating: any;
    checkInHour: string;
    checkOutHour: string;
    paymentMeans: [
      {
        program: string;
        items: T_PAYMENT_MEANS_ITEM[];
      }
    ];
    customerRequestAccepted: boolean;
    codes: T_ACCOR_CODE_ITEM[];
    pms: {
      interface: {
        code: string;
        label: string;
      };
      transaction: {};
    };
    crs: string;
  };
  source: string;
  price: number;
};
