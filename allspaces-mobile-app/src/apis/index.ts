import axios from "axios";
import { envConfig } from "@/utils/envConfig";
import { SecureStoreService } from "@/config/secureStore";
import { showSnackbar } from "@/utils/essentials";
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
import { actionSetCurrentUser } from "@/redux/app.slice";
import { useDispatch } from "@/redux/hooks";

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
    console.log("REQ ERROR API => ", JSON.stringify(error));
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("ERROR API => ", JSON.stringify(error));
    if (!axios.isCancel(error)) {
      const statusCode = error?.response?.status;
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      if (statusCode >= 500) {
        showSnackbar(errorMessage, "error");
      }
    }
    return Promise.reject(error);
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
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_CONDITIONS: "/terms-and-conditions",
};

export const queryKeys = {
  notifications: () => [API_ROUTES.GET_NOTIFICATIONS] as const,
  faqs: () => [API_ROUTES.GET_FAQS] as const,
  currentUser: () => [API_ROUTES.GET_CURRENT_USER] as const,
  bookingById: (id: string) => [API_ROUTES.GET_BOOKINGS_BY_ID, id] as const,
  preferences: () => [API_ROUTES.GET_PREFERENCES] as const,
  myPreferences: () => [API_ROUTES.GET_MY_PREFERENCES] as const,
  profiles: () => [API_ROUTES.GET_PROFILES] as const,
  profileFilters: () => [API_ROUTES.PROFILE_FILTERS] as const,
  profileById: (profileId: string) =>
    [API_ROUTES.GET_PROFILES_BY_ID, profileId] as const,
  categories: () => [API_ROUTES.CATEGORIES] as const,
  searchProfiles: (params: {
    limit: number;
    location?: { lat: number; lng: number };
    categoryIds?: string[];
  }) => [API_ROUTES.SEARCH_PROFILES, params] as const,
  bookings: (params: { limit: number; status?: string }) =>
    [API_ROUTES.GET_BOOKINGS, params] as const,
  wishlist: (params: { limit: number }) => [API_ROUTES.WISHLIST, params] as const,
  privacyPolicy: () => [API_ROUTES.PRIVACY_POLICY] as const,
  termsConditions: () => [API_ROUTES.TERMS_CONDITIONS] as const,
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
    queryKey: queryKeys.notifications(),
    queryFn: async ({ signal }) => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_NOTIFICATIONS,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetFAQsAPI = () => {
  return useQuery({
    queryKey: queryKeys.faqs(),
    queryFn: async ({ signal }): Promise<T_FAQ[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_FAQS,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetCurrentUserAPI = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: async ({ signal }): Promise<T_USER> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_CURRENT_USER,
        signal,
      });
      dispatch(actionSetCurrentUser(response.data));
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
    queryKey: queryKeys.bookingById(id),
    enabled: Boolean(id),
    queryFn: async ({ signal }): Promise<T_BOOKING_ITEM> => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.GET_BOOKINGS}/${id}`,
        signal,
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
    queryKey: queryKeys.preferences(),
    queryFn: async ({ signal }): Promise<T_GET_PREFERENCES_API> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_PREFERENCES,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetMyPreferencesAPI = () => {
  return useQuery({
    queryKey: queryKeys.myPreferences(),
    queryFn: async ({ signal }): Promise<any> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_MY_PREFERENCES,
        signal,
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
    queryKey: queryKeys.profiles(),
    queryFn: async ({ signal }): Promise<T_GET_PROFILE_ITEM[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_PROFILES,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetProfileFiltersAPI = () => {
  return useQuery({
    queryKey: queryKeys.profileFilters(),
    queryFn: async ({ signal }): Promise<T_PROFILE_FILTERS_API> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.PROFILE_FILTERS,
        signal,
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
    queryKey: queryKeys.searchProfiles({ limit, location, categoryIds }),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.SEARCH_PROFILES,
        data: {
          categoryIds,
          page: pageParam,
          limit,
          location,
        },
        signal,
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
    queryKey: queryKeys.bookings({ limit, status }),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.GET_BOOKINGS,
        params: {
          page: pageParam,
          limit,
          status,
        },
        signal,
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
    queryKey: queryKeys.profileById(profileId),
    enabled: Boolean(profileId),
    queryFn: async ({ signal }): Promise<T_PROFILE_ITEM> => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.GET_PROFILES}/${profileId}`,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetCategoriesAPI = () => {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async ({ signal }): Promise<T_CATEGORY_ITEM[]> => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.CATEGORIES,
        signal,
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
      return { profileId, isWishlisted: !isWishlisted };
    },
    // Optimistic update - runs immediately before the API call
    onMutate: async ({ profileId, isWishlisted }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [API_ROUTES.SEARCH_PROFILES] });
      await queryClient.cancelQueries({ queryKey: [API_ROUTES.WISHLIST] });

      // Snapshot the previous values
      const previousSearchData = queryClient.getQueriesData({
        queryKey: [API_ROUTES.SEARCH_PROFILES],
      });
      const previousWishlistData = queryClient.getQueriesData({
        queryKey: [API_ROUTES.WISHLIST],
      });

      // Optimistically update search profiles cache
      queryClient.setQueriesData<T_SEARCH_PROFILE_API>(
        { queryKey: [API_ROUTES.SEARCH_PROFILES] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: T_SEARCH_PROFILE_API) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === profileId
                  ? { ...item, isInWishlist: !isWishlisted }
                  : item
              ),
            })),
          };
        }
      );

      // Optimistically update wishlist cache (remove item if removing from wishlist)
      if (isWishlisted) {
        queryClient.setQueriesData<T_WISHLIST_API>(
          { queryKey: [API_ROUTES.WISHLIST] },
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages?.map((page: any) => ({
                ...page,
                data: page.data.filter(
                  (item: T_WISHLIST_ITEM) => item.profile.id !== profileId
                ),
              })),
            };
          }
        );
      }

      // Return context with previous values for rollback
      return { previousSearchData, previousWishlistData };
    },
    // If mutation fails, rollback to previous values
    onError: (err, variables, context) => {
      if (context?.previousSearchData?.length) {
        context.previousSearchData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousWishlistData?.length) {
        context.previousWishlistData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    // After success or error, invalidate to refetch fresh data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [API_ROUTES.WISHLIST] });
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
    queryKey: queryKeys.wishlist({ limit }),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.WISHLIST,
        params: {
          page: pageParam,
          limit,
        },
        signal,
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

export const useGetPrivacyPolicyAPI = () => {
  return useQuery({
    queryKey: queryKeys.privacyPolicy(),
    queryFn: async ({ signal }) => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.PRIVACY_POLICY}`,
        signal,
      });
      return response.data;
    },
  });
};

export const useGetTermsConditionsAPI = () => {
  return useQuery({
    queryKey: queryKeys.termsConditions(),
    queryFn: async ({ signal }) => {
      const response = await apiClient({
        method: "get",
        url: `${API_ROUTES.TERMS_CONDITIONS}`,
        signal,
      });
      return response.data;
    },
  });
};

export const useContactSupportAPI = () => {
  return useMutation({
    mutationKey: ["/contacts"],
    mutationFn: async (data: { subject: string; message: string }) => {
      const response = await apiClient({
        method: "post",
        url: "/contacts",
        data,
      });
      return response.data;
    },
  });
};

export const useSubmitPaymentAPI = () => {
  return useMutation({
    mutationKey: ["/mobile/payments/create_payment_intent"],
    mutationFn: async (details: {
      profile_id: string;
      check_in: string;
      time: string;
      no_of_guests: number;
      source: string;
    }) => {
      const response = await apiClient({
        method: "post",
        url: "/mobile/payments/create_payment_intent",
        data: details,
      });
      return response.data;
    },
  });
};

export const useUpdatePaymentMethodAPI = () => {
  return useMutation({
    mutationKey: ["/mobile/payments/update_stripe_setup_intent"],
    mutationFn: async (details: { user_id: string }) => {
      const response = await apiClient({
        method: "post",
        url: "/mobile/payments/update_stripe_setup_intent",
        data: details,
      });
      return response.data;
    },
  });
};
