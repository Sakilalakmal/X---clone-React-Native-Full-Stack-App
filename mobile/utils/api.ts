import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://192.168.8.158:3000";

export const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    console.log(
      "API Request:",
      config.url,
      token ? "Token present" : "No token"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log("API Success:", response.config.url, response.status);
      return response;
    },
    (error) => {
      console.log("API Error Details:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const useApi = {
  syncUser: (api: AxiosInstance) => api.post("/api/users/sync"),
  getCurrentuser: (api: AxiosInstance) => api.get("/api/users/me"),
  updateUserProfile: (api: AxiosInstance, data: any) =>
    api.put("/api/users/profile", data),
};
