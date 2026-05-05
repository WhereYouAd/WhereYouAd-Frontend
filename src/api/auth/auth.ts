import type {
  IEmailSendRequest,
  IEmailSendResponse,
  IEmailVerifyRequest,
  ILoginRequest,
  ILoginResponse,
  IMyPageInfoResponse,
  IPasswordResetRequest,
  ISignUpRequest,
  ISignUpResponse,
  ISmsSendRequest,
  ISmsSendResponse,
  ISmsVerifyRequest,
  ISmsVerifyResponse,
  ITokenRefreshResponse,
} from "@/types/auth/auth";
import type { ICommonResponse } from "@/types/common/common";

import { authInstance, axiosInstance } from "@/lib/axiosInstance";

export const sendEmail = async ({
  email,
}: IEmailSendRequest): Promise<ICommonResponse<IEmailSendResponse>> => {
  const { data } = await axiosInstance.post("/api/users/email-send", { email });
  return data;
};

export const verifyEmail = async ({
  email,
  authCode,
}: IEmailVerifyRequest): Promise<ICommonResponse<string>> => {
  const { data } = await axiosInstance.post("/api/users/email-verify", {
    email,
    authCode,
  });
  return data;
};

export const signUp = async ({
  email,
  password,
  name,
  phone_number,
}: ISignUpRequest): Promise<ICommonResponse<ISignUpResponse>> => {
  const { data } = await axiosInstance.post("/api/users/signup", {
    email,
    password,
    name,
    phone_number,
  });
  return data;
};

export const reissueToken = async (): Promise<
  ICommonResponse<ITokenRefreshResponse>
> => {
  // refreshToken 쿠키 기반 재발급은 credentials가 필요한 authInstance로 요청합니다.
  const { data } = await authInstance.post("/api/auth/reissue");
  return data;
};

export const login = async ({
  email,
  password,
}: ILoginRequest): Promise<ICommonResponse<ILoginResponse>> => {
  const { data } = await authInstance.post("/api/auth/login", {
    email,
    password,
  });
  return data;
};

export const sendSMS = async ({
  phoneNumber,
}: ISmsSendRequest): Promise<ICommonResponse<ISmsSendResponse>> => {
  const { data } = await axiosInstance.post("/api/users/sms-send", {
    phoneNumber,
  });
  return data;
};

export const verifySMS = async ({
  phoneNumber,
  verificationCode,
}: ISmsVerifyRequest): Promise<ICommonResponse<ISmsVerifyResponse>> => {
  const { data } = await axiosInstance.post("/api/users/sms-verify", {
    phoneNumber,
    verificationCode,
  });
  return data;
};

export const requestPasswordReset = async ({
  email,
}: IEmailSendRequest): Promise<ICommonResponse<IEmailSendResponse>> => {
  const { data } = await axiosInstance.post(
    "/api/users/password-reset/request",
    {
      email,
    },
  );
  return data;
};

export const resetPassword = async ({
  email,
  password,
}: IPasswordResetRequest): Promise<ICommonResponse<string>> => {
  const { data } = await axiosInstance.post(
    "/api/users/password-reset/confirm",
    {
      email,
      password,
    },
  );
  return data;
};

export const getMyInfo = async (): Promise<
  ICommonResponse<IMyPageInfoResponse>
> => {
  const { data } = await axiosInstance.get("/api/users/my");
  return data;
};
