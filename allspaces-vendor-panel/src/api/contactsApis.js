import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

export const FAQ_API_ROUTES = {
  GET_FAQS: "/faqs",
  CONTACT_SUPPORT: "/contacts",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_CONDITIONS: "/terms-and-conditions",
};

export const useGetFAQs = () => {
  return useQuery({
    queryKey: [FAQ_API_ROUTES.GET_FAQS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: FAQ_API_ROUTES.GET_FAQS,
      });
      return response.data;
    },
  });
};

export const useGetPrivacyPolicy = () => {
  return useQuery({
    queryKey: [FAQ_API_ROUTES.PRIVACY_POLICY],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: FAQ_API_ROUTES.PRIVACY_POLICY,
      });
      return response.data;
    },
  });
};

export const useAddTermsConditions = () => {
  return useMutation({
    mutationKey: [FAQ_API_ROUTES.TERMS_CONDITIONS],
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "post",
        url: FAQ_API_ROUTES.TERMS_CONDITIONS,
        data: {
          content: data.content,
        },
      });
      return response.data;
    },
  });
};

export const useAddPrivacyPolicy = () => {
  return useMutation({
    mutationKey: [FAQ_API_ROUTES.PRIVACY_POLICY],
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "post",
        url: FAQ_API_ROUTES.PRIVACY_POLICY,
        data: {
          content: data.content,
        },
      });
      return response.data;
    },
  });
};

export const useGetTermsConditions = () => {
  return useQuery({
    queryKey: [FAQ_API_ROUTES.TERMS_CONDITIONS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: FAQ_API_ROUTES.TERMS_CONDITIONS,
      });
      return response.data;
    },
  });
};

export const useContactSupport = () => {
  return useMutation({
    mutationKey: [FAQ_API_ROUTES.CONTACT_SUPPORT],
    mutationFn: async (data) => {
      const response = await apiClient({
        method: "get",
        url: FAQ_API_ROUTES.CONTACT_SUPPORT,
        data: { ...data },
      });
      return response.data;
    },
  });
};

const contactsApis = {
  faqs: async () => {
    try {
      const response = await axiosInstance.get("/api/faqs");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  contacts: async (subject, message) => {
    try {
      const response = await axiosInstance.get("/api/contacts", {
        subject,
        message,
      });
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default contactsApis;
