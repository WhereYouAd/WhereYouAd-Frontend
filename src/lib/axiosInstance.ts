import axios, { type AxiosRequestConfig } from "axios";

import type { IApiErrorResponse } from "@/types/common/common";

import useAuthStore from "@/store/useAuthStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !BASE_URL) {
  throw new Error("API 서버 주소(VITE_API_BASE_URL)가 설정되지 않았습니다.");
}

const baseConfig: AxiosRequestConfig = {
  baseURL: BASE_URL || undefined,
};

// 일반 API 요청용 인스턴스
export const axiosInstance = axios.create(baseConfig);

// 인증 전용 인스턴스 (쿠키 필요)
export const authInstance = axios.create({
  ...baseConfig,
  withCredentials: true,
});

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
      // AccessToken이 없는 상태라면 재발급을 시도할 근거가 없습니다.
      // (refreshToken 쿠키가 없을 경우 reissue 루프가 쉽게 발생)
      if (!useAuthStore.getState().accessToken) {
        return Promise.reject(
          (error.response?.data as IApiErrorResponse) ?? error,
        );
      }

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
