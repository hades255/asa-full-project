import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

export const USER_API_ROUTES = {
  GET_EMPLOYEES: `/users/employees`,
  SEARCH_EMPLOYEE: `/users/search_employees?keyword=`,
  CREATE_EMPLOYEE: `/users/create`,
  DELETE_EMPLOYEE: `/users`,
};

export const useGetEmployees = () => {
  return useQuery({
    queryKey: [USER_API_ROUTES.GET_EMPLOYEES],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: USER_API_ROUTES.GET_EMPLOYEES,
      });
      return response.data;
    },
  });
};

export const useSearchEmployee = () => {
  return useMutation({
    mutationKey: [USER_API_ROUTES.SEARCH_EMPLOYEE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "get",
        url: `${USER_API_ROUTES.SEARCH_EMPLOYEE}${details.keyword}`,
      });
      return response.data;
    },
  });
};

export const useDeleteEmployee = () => {
  return useMutation({
    mutationKey: [USER_API_ROUTES.DELETE_EMPLOYEE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "delete",
        url: `${USER_API_ROUTES.DELETE_EMPLOYEE}/${details.id}`,
      });
      return response.data;
    },
  });
};

export const useEditEmployee = () => {
  return useMutation({
    mutationKey: [USER_API_ROUTES.DELETE_EMPLOYEE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: `${USER_API_ROUTES.DELETE_EMPLOYEE}/${details.id}`,
        data: { ...details.data },
      });
      return response.data;
    },
  });
};

export const useCreateEmployee = () => {
  return useMutation({
    mutationKey: [USER_API_ROUTES.CREATE_EMPLOYEE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: USER_API_ROUTES.CREATE_EMPLOYEE,
        data: {
          ...details,
        },
      });
      return response.data;
    },
  });
};

const usersApis = {
  createUser: async (name, email, phone, role, password, status) => {
    try {
      const response = await axiosInstance.post("/api/users/create", {
        name,
        email,
        phone,
        role,
        password,
        status,
      });
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  fetchUsersForVendor: async () => {
    try {
      const response = await axiosInstance.get("/api/users/employees");
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  searchUsersForVendor: async (keyword) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/search_employees?keyword=${keyword}`
      );
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default usersApis;
