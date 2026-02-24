import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, API_ROUTES } from "./api";

export const useSearchProfilesAPI = (
  limit,
  location,
  categoryIds
) => {
  return useInfiniteQuery({
    queryKey: [API_ROUTES.SEARCH_PROFILES, location, categoryIds],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient({
        method: "post",
        url: API_ROUTES.SEARCH_PROFILES,
        data: {
          categoryIds: categoryIds?.length ? categoryIds : undefined,
          page: pageParam,
          limit,
          location,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination || {};
      return page < pages ? page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
