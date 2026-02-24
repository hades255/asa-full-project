import { useMutation, useQuery } from "@tanstack/react-query";
import { getAccessToken } from "../utils/secureLs";
import axiosInstance from "./axiosInstance";
import { apiClient } from ".";

export const PROFILE_API_ROUTES = {
  MY_PROFILE: `/profiles/me`,
  BASIC_INFO: `/profiles/basic_info`,
  PROFILE_CATEGORIES: `/categories`,
  PROFILE_SUBCATEGORIES: `/subcategories`,
  PROFILE_FACILITY: `/facilities`,
  PROFILE_SERVICE: `/services`,
  PROFILE_MEDIAS: `/medias`,
  DELETE_PROFILE_MEDIA: `/delete-profile-media`,
  EDIT_PROFILE_MEDIA: `/edit-profile-media`,
  PROFILE_TOGGLE_STATUS: `/profiles/toggle-status`,
  PROFILE_EDIT_FACILITY: `profiles/edit-facility`,
  PROFILE_DELETE_FACILITY: `profiles/delete-facility`,
  PROFILE_EDIT_SERVICE: `profiles/edit-service`,
  PROFILE_EDIT_BASIC_INFO: `profiles/edit-basic_info`,
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: [PROFILE_API_ROUTES.MY_PROFILE],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: PROFILE_API_ROUTES.MY_PROFILE,
      });
      return response.data;
    },
  });
};

export const useToggleProfileStatus = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_TOGGLE_STATUS],
    mutationFn: async () => {
      const response = await apiClient({
        method: "post",
        url: PROFILE_API_ROUTES.PROFILE_TOGGLE_STATUS,
      });
      return response.data;
    },
  });
};

export const useGetProfileCategories = (includeSubcategories) => {
  return useQuery({
    queryKey: [PROFILE_API_ROUTES.PROFILE_CATEGORIES],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: PROFILE_API_ROUTES.PROFILE_CATEGORIES,
        params: { includeSubcategories },
      });
      return response.data;
    },
  });
};

export const useGetProfileSubCategories = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_SUBCATEGORIES],
    mutationFn: async (categoryId) => {
      const response = await apiClient({
        method: "get",
        url: `${PROFILE_API_ROUTES.PROFILE_CATEGORIES}/${categoryId}/subcategories`,
      });
      return response.data;
    },
  });
};

export const useProfileBasicInfo = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.MY_PROFILE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: PROFILE_API_ROUTES.BASIC_INFO,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: { ...details },
      });
      return response.data;
    },
  });
};

export const useEditProfileBasicInfo = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_EDIT_BASIC_INFO],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: `/profiles/${details.profileId}`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          name: details.name,
          description: details.description,
          email: details.email,
          location: details.location,
          address: details.address,
          coverMedia: details.coverMedia,
          eco_score: details.eco_score,
        },
      });
      return response.data;
    },
  });
};

export const useAddProfileFacility = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_FACILITY],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: `/profiles/${details.profileId}${PROFILE_API_ROUTES.PROFILE_FACILITY}`,
        data: { name: details.name },
      });
      return response.data;
    },
  });
};

export const useEditProfileFacility = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_EDIT_FACILITY],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: `/profiles/${details.profileId}/facilities/${details.facilityId}`,
        data: { name: details.name },
      });
      return response.data;
    },
  });
};

export const useDeleteProfileFacility = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_DELETE_FACILITY],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "delete",
        url: `/profiles/${details.profileId}/facilities/${details.facilityId}`,
      });
      return response.data;
    },
  });
};

export const useAddProfileService = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_SERVICE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "post",
        url: PROFILE_API_ROUTES.PROFILE_SERVICE,
        data: { ...details },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useEditProfileService = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_EDIT_SERVICE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: `${PROFILE_API_ROUTES.PROFILE_SERVICE}/${details.serviceId}`,
        data: {
          name: details.name,
          description: details.description,
          categoryId: details.categoryId,
          minSpend: details.minSpend,
          media: details.media,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useDeleteProfileService = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_SERVICE],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "delete",
        url: `${PROFILE_API_ROUTES.PROFILE_SERVICE}/${details.serviceId}`,
      });
      return response.data;
    },
  });
};

export const useDeleteProfileMedia = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.DELETE_PROFILE_MEDIA],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "delete",
        url: `/profiles/${details.profileId}${PROFILE_API_ROUTES.PROFILE_MEDIAS}/${details.mediaId}`,
      });
      return response.data;
    },
  });
};

export const useEditProfileMedia = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.EDIT_PROFILE_MEDIA],
    mutationFn: async (details) => {
      const response = await apiClient({
        method: "put",
        url: `/profiles/${details.profileId}${PROFILE_API_ROUTES.PROFILE_MEDIAS}/${details.mediaId}`,
        data: {
          media: details.media,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useGetServiceById = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_SERVICE],
    mutationFn: async (id) => {
      const response = await apiClient({
        method: "get",
        url: `${PROFILE_API_ROUTES.PROFILE_SERVICE}/${id}`,
      });
      return response.data;
    },
  });
};

export const useAddProfileMedia = () => {
  return useMutation({
    mutationKey: [PROFILE_API_ROUTES.PROFILE_MEDIAS],
    mutationFn: async (details) => {
      const formData = new FormData();

      // Append each file to FormData
      if (details.medias && details.medias.length > 0) {
        details.medias.forEach((file) => {
          formData.append("medias", file); // Ensure it matches the Multer field name
        });
      }

      const response = await apiClient({
        method: "post",
        url: `/profiles/${details.profileId}${PROFILE_API_ROUTES.PROFILE_MEDIAS}`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      return response.data;
    },
  });
};

const profilesApis = {
  fetchProfiles: async () => {
    try {
      const response = await axiosInstance.get("/api/profiles");
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  retrieveProfile: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/profiles/${id}`);
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/mobile/profiles/categories"
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  createNewProfileWithBasicInfo: async (
    name,
    description,
    email,
    location,
    coverMedia,
    eco_score,
    status,
    categoryId
  ) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        "/api/profiles/basic_info",
        {
          name,
          description,
          email,
          location,
          coverMedia,
          eco_score,
          status,
          categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  saveBasicProfile: async (
    id,
    name,
    description,
    email,
    location,
    coverMedia,
    eco_score,
    status,
    categoryId
  ) => {
    try {
      const token = getAccessToken();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("email", email);
      formData.append("location", location);
      formData.append("eco_score", eco_score);
      formData.append("status", status);
      formData.append("categoryId", categoryId);

      // Only append coverMedia if a new file is uploaded
      if (coverMedia instanceof File) {
        formData.append("coverMedia", coverMedia);
      }

      const response = await axiosInstance.put(
        `/api/profiles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  addProfileFacility: async (id, name) => {
    try {
      const response = await axiosInstance.post(
        `/api/profiles/${id}/facilities`,
        { name }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  addProfileService: async (
    id,
    name,
    rate,
    minSpend,
    unitMeasure,
    description,
    media
  ) => {
    try {
      const token = getAccessToken();
      const formData = new FormData();

      formData.append("name", name);
      formData.append("rate", rate);
      formData.append("minSpend", minSpend);
      formData.append("unitMeasure", unitMeasure);
      formData.append("description", description);
      formData.append("media", media); // Ensure it matches the Multer field name

      const response = await axiosInstance.post(
        `/api/profiles/${id}/services`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  updateProfileService: async (
    id,
    profileId,
    name,
    rate,
    minSpend,
    unitMeasure,
    description,
    media
  ) => {
    try {
      const token = getAccessToken();
      const formData = new FormData();

      formData.append("name", name);
      formData.append("rate", rate);
      formData.append("minSpend", minSpend);
      formData.append("unitMeasure", unitMeasure);
      formData.append("description", description);
      formData.append("media", media); // Ensure it matches the Multer field name

      const response = await axiosInstance.put(
        `/api/profiles/${profileId}/services/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
  addProfileMedias: async (id, medias) => {
    try {
      const token = getAccessToken();
      const formData = new FormData();

      // Append each file to FormData
      if (medias && medias.length > 0) {
        medias.forEach((file) => {
          formData.append("medias", file); // Ensure it matches the Multer field name
        });
      }

      const response = await axiosInstance.post(
        `/api/profiles/${id}/medias`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error || "An error occurred";
    }
  },
};

export default profilesApis;
