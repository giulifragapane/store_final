import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let refreshQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processRefreshQueue = (error: unknown = null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  refreshQueue = [];
};

const shouldTryRefresh = (url?: string) => {
  if (!url) return false;

  return (
    !url.includes("/api/v1/auth/login") &&
    !url.includes("/api/v1/auth/token") &&
    !url.includes("/api/v1/auth/refresh") &&
    !url.includes("/api/v1/auth/logout")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      shouldTryRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          await new Promise<void>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          });

          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      try {
        await api.post("/api/v1/auth/refresh");
        processRefreshQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.detail ||
      error.message ||
      "Error inesperado en la petición";

    return Promise.reject(new Error(message));
  },
);
