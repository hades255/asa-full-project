import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

const AUTH_API_ROUTES = {
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/register`,
  VERIFY_OTP: `/auth/otp`,
  FORGOT_PASSWORD: `/auth/forgot_password`,
  RESET_PASSWORD: `/auth/reset_password`,
  CHANGE_PASSWORD: `/auth/change-password`,
};

export const useLogin = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.LOGIN],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: AUTH_API_ROUTES.LOGIN,
        data: { email: details.email, password: details.password },
      });
      return response.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.CHANGE_PASSWORD],
    mutationFn: async (details) => {
      console.log("details => ", details);
      const response = await apiClient({
        method: "put",
        url: AUTH_API_ROUTES.CHANGE_PASSWORD,
        data: {
          currentPassword: details.currentPassword,
          newPassword: details.newPassword,
        },
      });
      return response.data;
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.SIGNUP],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: AUTH_API_ROUTES.SIGNUP,
        data: { email: details.email, password: details.password },
      });
      return response.data;
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.VERIFY_OTP],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: AUTH_API_ROUTES.VERIFY_OTP,
        data: { ...details },
      });
      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.FORGOT_PASSWORD],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: AUTH_API_ROUTES.FORGOT_PASSWORD,
        data: { ...details },
      });
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: [AUTH_API_ROUTES.RESET_PASSWORD],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: AUTH_API_ROUTES.RESET_PASSWORD,
        data: { ...details },
      });
      return response.data;
    },
  });
};

const authApis = {
  signIn: async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  signUp: async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", {
        email,
        password,
      });
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
  verifyOtp: async (email, otp, type) => {
    try {
      const response = await axiosInstance.post("/api/auth/otp", {
        email,
        otp,
        type,
      });
      return response;
    } catch (error) {
      console.log("error => ", error);
      throw error.response?.data || "An error occurred";
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot_password", {
        email,
      });
      console.log("main response => ", response);

      return response;
    } catch (error) {
      console.log("error => ", error);
      throw error.response?.data || "An error occurred";
    }
  },
  resetPassword: async (email, newPassword) => {
    try {
      const response = await axiosInstance.put("/api/auth/reset_password", {
        email,
        newPassword,
      });
      console.log("main response => ", response);

      return response;
    } catch (error) {
      console.log("error => ", error);
      throw error.response?.data || "An error occurred";
    }
  },
};

export default authApis;
