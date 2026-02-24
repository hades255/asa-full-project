import axios from "axios";
import { envConfig } from "@/utils/envConfig";
import { SecureStoreService } from "@/config/secureStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  T_BOOKING_API,
  T_BOOKING_ITEM,
  T_CATEGORY_ITEM,
  T_CREATE_CUSTOMER_API,
  T_CREATE_PAYMENT_INTENT_API,
  T_CREATE_STRIPE_CUSTOMER_BODY,
  T_CREATE_STRIPE_INTENT_BODY,
  T_FAQ,
  T_GET_PREFERENCES_API,
  T_GET_PROFILE_ITEM,
  T_PROFILE_FILTERS_API,
  T_REGISTER_USER_BODY,
  T_SEARCH_PROFILE_API,
  T_USER,
  T_WISHLIST_API,
} from "./types";
import {
  T_PROFILE_ITEM,
  T_WISHLIST_ITEM,
} from "@/components/cards/bookingCardWithReviews/types";
import { store } from "@/redux/store";
import { actionSetCurrentUser } from "@/redux/app.slice";

export const apiClient = axios.create({
  baseURL: envConfig.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  timeoutErrorMessage: `Request is timedout`,
  headers: {
    key: envConfig.EXPO_PUBLIC_API_KEY,
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    config.headers["session-id"] = await SecureStoreService.getValue(
      "SESSION_ID"
    );
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const API_ROUTES = {
  REGISTER_USER: "/mobile/users",
  GET_CURRENT_USER: "/mobile/users/me",
  CREATE_STRIPE_CUSTOMER: "/mobile/payments/stripe_customers",
  CREATE_STRIPE_INTENT: "/mobile/payments/stripe_setup_intent",
  GET_PREFERENCES: "/mobile/preferences/all",
  GET_MY_PREFERENCES: "/mobile/preferences/user-preferences",
  UPDATE_PREFERENCES: "/mobile/preferences/user-preferences",
  CREATE_PREFERENCES: "/mobile/preferences/user-preferences",
  GET_PROFILES: "/mobile/profiles",
  SEARCH_PROFILES: "/mobile/profiles/search",
  GET_PROFILES_BY_ID: "/mobile/profiles/{id}",
  CATEGORIES: "/categories",
  WISHLIST: "/mobile/wishlists",
  ADD_TO_WISHLIST: "/mobile/wishlists/add",
  UPDATE_WISHLIST: "/mobile/wishlists/update",
  REMOVE_FROM_WISHLIST: "/mobile/wishlists/remove",
  GET_WISHLIST: "/mobile/wishlists/get",
  CREATE_BOOKING: "/mobile/bookings/create",
  GET_BOOKINGS: "/mobile/bookings",
  GET_BOOKINGS_BY_ID: "/mobile/bookings/{id}",
  CREATE_PAYMENT_INTENT: "/mobile/payments/create_payment_intent",
  RATE_BOOKING: "/mobile/reviews",
  GET_NOTIFICATIONS: "/mobile/notifications",
  GET_FAQS: "/faqs",
  PROFILE_FILTERS: "/mobile/profiles/filters",
  UPDATE_BOOKING_STATUS: "/mobile/bookings/{id}/start",
};

export const useRegisterUserAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.REGISTER_USER],
    mutationFn: async (data: T_REGISTER_USER_BODY) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.REGISTER_USER,
        data: data,
      });
      return response.data;
    },
  });
};

export const useGetNotificationsAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_NOTIFICATIONS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_NOTIFICATIONS,
      });
      return response.data;
    },
  });
};

export const useGetFAQsAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_FAQS],
    queryFn: async (): Promise<T_FAQ[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_FAQS,
      });
      return response.data;
    },
  });
};

export const useGetCurrentUserAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_CURRENT_USER],
    queryFn: async (): Promise<T_USER> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_CURRENT_USER,
      });
      store.dispatch(actionSetCurrentUser(response.data));
      return response.data;
    },
  });
};

export const useCreateStripeCustomerAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.CREATE_STRIPE_CUSTOMER],
    mutationFn: async (
      data: T_CREATE_STRIPE_CUSTOMER_BODY
    ): Promise<T_CREATE_CUSTOMER_API> => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.CREATE_STRIPE_CUSTOMER,
        data: data,
      });
      return response.data;
    },
  });
};

export const useCreateStripeIntentAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.CREATE_STRIPE_INTENT],
    mutationFn: async (
      data: T_CREATE_STRIPE_INTENT_BODY
    ): Promise<T_CREATE_PAYMENT_INTENT_API> => {
      console.log("deat", data);

      const response = await apiClient({
        method: "post",
        url: API_ROUTES.CREATE_STRIPE_INTENT,
        data: data,
      });
      return response.data;
    },
  });
};

export const useGetBookingById = (id: string) => {
  return useQuery({
    queryKey: [API_ROUTES.GET_BOOKINGS_BY_ID],
    queryFn: async (): Promise<T_BOOKING_ITEM> => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.GET_BOOKINGS}/${id}`,
      });
      return response.data;
    },
  });
};

export const useStartBookingByID = () => {
  return useMutation({
    mutationKey: [API_ROUTES.UPDATE_BOOKING_STATUS],
    mutationFn: async (details: { id: string }) => {
      const response = await apiClient({
        method: "post",
        url: `/mobile/bookings/${details.id}/start`,
      });
      return response.data;
    },
  });
};

export const useGetPreferencesAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_PREFERENCES],
    queryFn: async (): Promise<T_GET_PREFERENCES_API> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_PREFERENCES,
      });
      return response.data;
    },
  });
};

export const useGetMyPreferencesAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_MY_PREFERENCES],
    queryFn: async (): Promise<any> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_MY_PREFERENCES,
      });
      return response.data;
    },
  });
};

export const useUpdatePreferencesAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.UPDATE_PREFERENCES],
    mutationFn: async (preferenceIds: string[]): Promise<any> => {
      const response = await apiClient({
        method: "put",
        url: API_ROUTES.UPDATE_PREFERENCES,
        data: { preferenceIds },
      });
      return response.data;
    },
  });
};

export const useCreatePreferencesAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.CREATE_PREFERENCES],
    mutationFn: async (preferenceIds: string[]): Promise<any> => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.CREATE_PREFERENCES,
        data: { preferenceIds },
      });
      return response.data;
    },
  });
};

export const useGetProfilesAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.GET_PROFILES],
    queryFn: async (): Promise<T_GET_PROFILE_ITEM[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_PROFILES,
      });
      return response.data;
    },
  });
};

export const useGetProfileFiltersAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.PROFILE_FILTERS],
    queryFn: async (): Promise<T_PROFILE_FILTERS_API> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.PROFILE_FILTERS,
      });
      return response.data;
    },
  });
};

export const useUpdateBookingStatusAPI = () => {
  return useMutation({
    mutationKey: ["/api/bookings/{id}"],
    mutationFn: async (details: { id: string }) => {
      const response = await apiClient({
        method: "patch",
        url: `/api/bookings/${details.id}`,
      });
      return response.data;
    },
  });
};

export const useSearchProfilesAPI = (
  limit: number,
  location?: { lat: number; lng: number },
  categoryIds?: string[]
) => {
  return useInfiniteQuery<T_SEARCH_PROFILE_API>({
    queryKey: [API_ROUTES.SEARCH_PROFILES],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.SEARCH_PROFILES,
        data: {
          categoryIds,
          page: pageParam,
          limit,
          location,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined; // no more pages if reached limit
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateBookingAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.CREATE_BOOKING],
    mutationFn: async (details: {
      profile_id: string;
      check_in: string;
      no_of_guests: number;
      source: string;
      serviceIds: string[];
      location: {
        lat: number;
        lng: number;
      };
      address: string;
    }): Promise<{
      booking: { id: string };
      message: string;
    }> => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.CREATE_BOOKING,
        data: {
          ...details,
        },
      });
      return response.data;
    },
  });
};

export const useGetBookingsAPI = (limit: number, status?: string) => {
  return useInfiniteQuery<T_BOOKING_API>({
    queryKey: [API_ROUTES.GET_BOOKINGS],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_BOOKINGS,
        params: {
          page: pageParam,
          limit,
          status,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined; // no more pages if reached limit
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetProfileByIdAPI = (profileId: string) => {
  return useQuery({
    queryKey: [API_ROUTES.GET_PROFILES_BY_ID, profileId],
    queryFn: async (): Promise<T_PROFILE_ITEM> => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.GET_PROFILES}/${profileId}`,
      });
      return response.data;
    },
  });
};

export const useGetCategoriesAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.CATEGORIES],
    queryFn: async (): Promise<T_CATEGORY_ITEM[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.CATEGORIES,
      });
      return response.data;
    },
  });
};

export const useRateBookingAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.RATE_BOOKING],
    mutationFn: async (details: {
      profileId: string;
      bookingId: string;
      rating: number;
      comment: string;
    }) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.RATE_BOOKING,
        data: { ...details },
      });
      return response.data;
    },
  });
};

export const useUpdateWishlistAPI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [API_ROUTES.UPDATE_WISHLIST],
    mutationFn: async ({
      profileId,
      isWishlisted,
    }: {
      profileId: string;
      isWishlisted: boolean;
    }) => {
      await apiClient({
        method: isWishlisted ? "delete" : "post",
        url: isWishlisted
          ? `${API_ROUTES.WISHLIST}/${profileId}`
          : API_ROUTES.WISHLIST,
        data: !isWishlisted && { profileId },
      });
      return { profileId, isWishlisted: !isWishlisted }; // return updated status
    },
    onSuccess: ({ profileId, isWishlisted }) => {
      queryClient.setQueryData<T_SEARCH_PROFILE_API[]>(
        [API_ROUTES.SEARCH_PROFILES],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: T_SEARCH_PROFILE_API) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === profileId
                  ? { ...item, isInWishlist: isWishlisted }
                  : item
              ),
            })),
          };
        }
      );

      queryClient.setQueryData<T_WISHLIST_API[]>(
        [API_ROUTES.WISHLIST],
        (oldData: any) => {
          if (!oldData) return oldData;

          let updatedData = oldData.filter(
            (item: T_WISHLIST_ITEM) => item.profile.id != profileId
          );

          return updatedData;
        }
      );
    },
  });
};

export const useAddToWishlistAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.ADD_TO_WISHLIST],
    mutationFn: async (profileId: string) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.WISHLIST,
        data: { profileId },
      });
      return response.data;
    },
  });
};

export const useRemoveFromWishlistAPI = () => {
  return useMutation({
    mutationKey: [API_ROUTES.REMOVE_FROM_WISHLIST],
    mutationFn: async (profileId: string) => {
      const response = await apiClient({
        method: "delete",
        url: `${API_ROUTES.WISHLIST}/${profileId}`,
      });
      return response.data;
    },
  });
};

export const useGetWishlists = (limit: number) => {
  return useInfiniteQuery<T_WISHLIST_API>({
    queryKey: [API_ROUTES.WISHLIST],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.WISHLIST,
        // data: {
        //   page: pageParam,
        //   limit,
        // },
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined; // no more pages if reached limit
    },
    refetchOnWindowFocus: false,
  });
};

// export const useGetWishlists = () => {
//   return useQuery({
//     queryKey: [API_ROUTES.GET_WISHLIST],
//     queryFn: async (): Promise<T_WISHLIST_ITEM[]> => {
//       const response = await apiClient({
//         method: "get",
//         url: `${API_ROUTES.WISHLIST}`,
//       });
//       return response.data;
//     },
//   });
// };

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationKey: [API_ROUTES.CREATE_PAYMENT_INTENT],
    mutationFn: async (details: {
      booking_id: string;
    }): Promise<{
      customerEphemeralKeySecret: string;
      customerId: string;
      paymentIntentClientSecret: string;
    }> => {
      const response = await apiClient({
        method: "post",
        url: `${API_ROUTES.CREATE_PAYMENT_INTENT}`,
        data: {
          booking_id: details.booking_id,
        },
      });
      return response.data;
    },
  });
};
