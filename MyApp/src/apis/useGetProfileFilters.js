import { useQuery } from "@tanstack/react-query";
import { apiClient, API_ROUTES } from "./api";

export const useGetProfileFiltersAPI = () => {
  return useQuery({
    queryKey: [API_ROUTES.PROFILE_FILTERS],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: API_ROUTES.PROFILE_FILTERS,
      });
      return response.data;
    },
  });
};
