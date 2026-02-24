import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

export const ORDER_API_ROUTES = {
  ORDERS_LIST: `/orders/list`,
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: [ORDER_API_ROUTES.ORDERS_LIST],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: ORDER_API_ROUTES.ORDERS_LIST,
      });
      return response.data;
    },
  });
};

const ordersApis = {
  fetchOrders: async () => {
    try {
      const response = await axiosInstance.get("/api/orders/list");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default ordersApis;
