import axios, { type AxiosRequestConfig } from "axios";

import useAuthStore from "@/store/useAuthStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 환경변수 확인
if (!BASE_URL) {
  throw new Error("API 서버 주소(VITE_API_BASE_URL)가 설정되지 않았습니다.");
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// 일반 요청용 인스턴스
export const axiosInstance = axios.create(axiosConfig);

// 토큰 재발급 요청용 인스턴스
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

// 토큰 재발급 상태 및 대기열
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 대기 중인 요청 처리
const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

// 대기열에 요청 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// [응답 인터셉터] 토큰 만료 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 인증 에러 발생
    if (error.response?.status === 401) {
      // 이미 재발급 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      // 재발급 요청 자체가 실패했거나 이미 재시도한 경우 -> 로그아웃
      if (
        originalRequest.url?.includes("/api/auth/reissue") ||
        originalRequest._retry
      ) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // 첫 401 에러, 재발급 시도
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await authInstance.post("/api/auth/reissue");

        const newAccessToken = data.data.accessToken;

        // 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken);

        // 대기 중이던 요청들 일괄 처리
        onRefreshed(newAccessToken);

        // 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 시 로그아웃
        console.error("토큰 재발급 실패:", refreshError);
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
