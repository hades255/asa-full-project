import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { envConfig } from "../config/env";

/**
 * Fetch categories from intent-layer backend for filter UI.
 * Returns same shape as AllSpaces filters: { filters: { categories: [...] } }
 */
export function useGetIntentCategories() {
  const baseUrl = (envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL || "").replace(/\/?$/, "");
  const url = `${baseUrl}/intent/categories`;

  return useQuery({
    queryKey: ["intent-categories"],
    queryFn: async () => {
      const res = await axios.get(url, {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
  });
}
