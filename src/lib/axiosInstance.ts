import axios, { type AxiosRequestConfig } from "axios";

import useAuthStore from "@/store/useAuthStore";

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// 일반 API 요청용
export const axiosInstance = axios.create(axiosConfig);

// 토큰 재발급 전용
export const authInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

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
let refreshSubscribers: ((token: string) => void)[] = [];

// 대기 요청 처리
const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 감지
    if (error.response?.status === 401) {
      // 재발급 진행 중: 대기열 등록
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      // 재발급 실패: 로그아웃
      if (
        originalRequest.url?.includes("/api/auth/reissue") ||
        originalRequest._retry
      ) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // 첫 401: 재발급 시도
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await authInstance.post("/api/auth/reissue");

        const newAccessToken = data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 대기 요청 일괄 처리
        onRefreshed(newAccessToken);

        // 현재 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 재발급 실패: 로그아웃
        console.error("Token reissue failed:", refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        // 상태 초기화
        isRefreshing = false;
        refreshSubscribers = [];
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
