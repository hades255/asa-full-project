import axiosInstance from "./axiosInstance";

const searchesApis = {
  globalSearchAPI: async (keyword) => {
    try {
      const response = await axiosInstance.get(`/api/search?keyword=${keyword}`);
      console.log("main response => ", response);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred";
    }
  },
};

export default searchesApis;
