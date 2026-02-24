import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from "./";
export const DASHBOARD_API_ROUTES = {
  DATA: "/dashboard/data",
  ANALYTICS: `/dashboard/analytics`,
  STATS: `/dashboard/stats`,
  ORDERS_OVERVIEW: `/dashboard/orders_overview_stats`,
  NOTIFICATIONS: `/notifications`,
};

export const useGetDashboardAnalytics = () => {
  return useQuery({
    queryKey: [DASHBOARD_API_ROUTES.ANALYTICS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: DASHBOARD_API_ROUTES.ANALYTICS,
      });
      return response.data;
    },
  });
};

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: [DASHBOARD_API_ROUTES.DATA],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: DASHBOARD_API_ROUTES.DATA,
      });
      return response.data;
    },
  });
};

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: [DASHBOARD_API_ROUTES.STATS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: DASHBOARD_API_ROUTES.STATS,
      });
      return response.data;
    },
  });
};

export const useGetDashboardOrdersOverview = () => {
  return useQuery({
    queryKey: [DASHBOARD_API_ROUTES.ORDERS_OVERVIEW],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: DASHBOARD_API_ROUTES.ORDERS_OVERVIEW,
      });
      return response.data;
    },
  });
};

export const useGetDashboardNotifications = () => {
  return useQuery({
    queryKey: [DASHBOARD_API_ROUTES.NOTIFICATIONS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: DASHBOARD_API_ROUTES.NOTIFICATIONS,
      });
      return response.data;
    },
  });
};

const dashboardApis = {
  analytics: async () => {
    try {
      const response = await axiosInstance.get("/api/dashboard/analytics");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  stats: async () => {
    try {
      const response = await axiosInstance.get("/api/dashboard/stats");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  ordersOverviewStats: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/dashboard/orders_overview_stats"
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  notifications: async () => {
    try {
      const response = await axiosInstance.get("/api/notifications");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default dashboardApis;
