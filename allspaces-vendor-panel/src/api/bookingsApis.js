import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

export const BOOKING_API_ROUTES = {
  BOOKINGS: `/bookings`,
  BOOKINGS_CALENDAR: `/bookings/calendar`,
  CUSTOMER_REVIEW: `/reviews/customer/create`,
};

export const useGetBookings = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: [BOOKING_API_ROUTES.BOOKINGS],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient({
        method: "get",
        url: BOOKING_API_ROUTES.BOOKINGS,
        data: {
          page: pageParam,
          limit,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined; // no more pages if reached limit
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetBookingById = (booking_id) => {
  return useQuery({
    queryKey: [BOOKING_API_ROUTES.BOOKINGS, booking_id],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `${BOOKING_API_ROUTES.BOOKINGS}/${booking_id}`,
      });
      return response.data;
    },
  });
};

export const useGetBookingsCalendar = () => {
  return useQuery({
    queryKey: [BOOKING_API_ROUTES.BOOKINGS_CALENDAR],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: BOOKING_API_ROUTES.BOOKINGS_CALENDAR,
      });
      return response.data;
    },
  });
};

export const useUpdateBookingsStatus = () => {
  return useMutation({
    mutationKey: [BOOKING_API_ROUTES.BOOKINGS],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "patch",
        url: `${BOOKING_API_ROUTES.BOOKINGS}/${details.bookingId}`,
        data: {
          status: details.status,
        },
      });
      return response.data;
    },
  });
};

export const useCreateCustomerReview = () => {
  return useMutation({
    mutationKey: [BOOKING_API_ROUTES.CUSTOMER_REVIEW],
    mutationFn: async (reviewData) => {
      const response = await apiClient({
        method: "post",
        url: BOOKING_API_ROUTES.CUSTOMER_REVIEW,
        data: {
          bookingId: reviewData.bookingId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      });
      return response.data;
    },
  });
};

export const useCancelBooking = () => {
  return useMutation({
    mutationKey: [BOOKING_API_ROUTES.BOOKINGS],
    mutationFn: async (cancelData) => {
      const response = await apiClient({
        method: "post",
        url: `${BOOKING_API_ROUTES.BOOKINGS}/${cancelData.bookingId}/cancel`,
        data: {
          cancellationReason: cancelData.cancellationReason,
        },
      });
      return response.data;
    },
  });
};

const bookingsApis = {
  fetchBookings: async () => {
    try {
      const response = await axiosInstance.get("/api/bookings");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  getBookingByID: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/bookings/${id}`);
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  updateBookingStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/api/bookings/${id}`, {
        status,
      });
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  bookingsForCalendarView: async (id, status) => {
    try {
      const response = await axiosInstance.get("/api/bookings/calendar");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  createCustomerReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post("/api/reviews/customer/create", {
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default bookingsApis;
