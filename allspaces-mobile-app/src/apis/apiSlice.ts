import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { apiClient } from ".";
import { envConfig } from "@/utils/envConfig";
import {
  T_CONTACT_SUPPORT_BODY,
  T_CREATE_BOOKING_API,
  T_CREATE_BOOKING_BODY,
  T_CREATE_CUSTOMER_API,
  T_CREATE_PAYMENT_INTENT_API,
  T_CREATE_STRIPE_CUSTOMER_BODY,
  T_CREATE_STRIPE_INTENT_BODY,
  T_GET_PROFILE_API,
  T_GET_PROFILE_BY_ID_API,
  T_GET_WISHLIST_API,
  T_RATE_BOOKING_API,
  T_RATE_BOOKING_BODY,
  T_REGISTER_USER_BODY,
  T_SUBMIT_PAYMENT_API,
  T_SUBMIT_PAYMENT_BODY,
  T_UPDATE_PAYMENT_METHOD_API,
  T_UPDATE_PAYMENT_METHOD_BODY,
} from "./types";

export const apiCalls = createApi({
  reducerPath: "apiCalls",
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.EXPO_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("key", envConfig.EXPO_PUBLIC_API_KEY ?? "");
      return headers;
    },
    responseHandler: (response) => {
      try {
        return response.json();
      } catch (error) {
        return response.text();
      }
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      queryFn: async (details: T_REGISTER_USER_BODY) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/users",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getPreferences: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/preferences",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getMyPreferences: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/preferences/my-preferences",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    updatePreferences: builder.mutation({
      queryFn: async (optionIds: string[]) => {
        try {
          const result = await apiClient({
            method: "put",
            url: "/mobile/preferences",
            data: { optionIds },
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    createStripeCustomer: builder.mutation({
      queryFn: async (
        details: T_CREATE_STRIPE_CUSTOMER_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/payments/stripe_customers",
            data: details,
          });
          return {
            data: result.data,
          };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    createStripeIntent: builder.mutation({
      queryFn: async (
        details: T_CREATE_STRIPE_INTENT_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/payments/stripe_setup_intent",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    updatePaymentMethod: builder.mutation({
      queryFn: async (
        details: T_UPDATE_PAYMENT_METHOD_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/payments/update_stripe_setup_intent",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    submitPayment: builder.mutation({
      queryFn: async (
        details: T_SUBMIT_PAYMENT_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/payments/create_payment_intent",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getBookings: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/bookings",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getBookingById: builder.query({
      queryFn: async (bookingId: string) => {
        try {
          const result = await apiClient({
            method: "get",
            url: `/mobile/bookings/${bookingId}`,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getCategories: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/profiles/categories",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getProfileWithCategories: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/profiles/grouped_by_categories",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    createBooking: builder.mutation({
      queryFn: async (
        details: T_CREATE_BOOKING_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/bookings/create",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getProfile: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/profiles",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getProfileById: builder.query({
      queryFn: async ({
        profileId,
        source,
      }: {
        profileId: string;
        source: string;
      }) => {
        try {
          const result = await apiClient({
            method: "get",
            url: `/mobile/profiles/${profileId}?source=${source}`,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getWishlists: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/wishlists",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    addToWishlist: builder.mutation({
      queryFn: async (profileId: string) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/wishlists",
            data: { profileId },
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    removeFromWishlist: builder.mutation({
      queryFn: async (profileId: string) => {
        try {
          const result = await apiClient({
            method: "delete",
            url: `/mobile/wishlists/${profileId}`,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    rateBooking: builder.mutation({
      queryFn: async (
        details: T_RATE_BOOKING_BODY
      ) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/mobile/reviews",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    getNotifications: builder.query({
      queryFn: async () => {
        try {
          const result = await apiClient({
            method: "get",
            url: "/mobile/notifications",
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    contactSupport: builder.mutation({
      queryFn: async (details: T_CONTACT_SUPPORT_BODY) => {
        try {
          const result = await apiClient({
            method: "post",
            url: "/contacts",
            data: details,
          });
          return { data: result.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateStripeCustomerMutation,
  useCreateStripeIntentMutation,
  useUpdatePaymentMethodMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useGetProfileQuery,
  useGetProfileByIdQuery,
  useGetWishlistsQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useSubmitPaymentMutation,
  useGetCategoriesQuery,
  useGetProfileWithCategoriesQuery,
  useGetBookingByIdQuery,
  useRateBookingMutation,
  useGetNotificationsQuery,
  useContactSupportMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetMyPreferencesQuery,
} = apiCalls;
