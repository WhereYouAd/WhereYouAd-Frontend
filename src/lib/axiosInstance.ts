import axios, { type AxiosRequestConfig } from "axios";

import type { IApiErrorResponse } from "@/types/common/common";

import useAuthStore from "@/store/useAuthStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("API 서버 주소(VITE_API_BASE_URL)가 설정되지 않았습니다.");
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true,
};

export const axiosInstance = axios.create(axiosConfig);
export const authInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
interface IRefreshSubscriber {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let refreshSubscribers: IRefreshSubscriber[] = [];

const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(accessToken));
  refreshSubscribers = [];
};

const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void,
) => {
  refreshSubscribers.push({ resolve, reject });
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber(
            (accessToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              resolve(axiosInstance(originalRequest));
            },
            (refreshError: unknown) => {
              reject(refreshError);
            },
          );
        });
      }

      if (
        originalRequest.url?.includes("/api/auth/reissue") ||
        originalRequest._retry
      ) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await authInstance.post("/api/auth/reissue");

        const newAccessToken = data.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        onRefreshFailed(refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshSubscribers = [];
      }
    }

    return Promise.reject((error.response?.data as IApiErrorResponse) ?? error);
  },
);
