import type {
  IEmailSendRequest,
  IEmailSendResponse,
  IEmailVerifyRequest,
  ILoginRequest,
  ILoginResponse,
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

import { axiosInstance } from "@/lib/axiosInstance";

// 이메일 인증 코드 전송
export const sendEmail = async ({
  email,
}: IEmailSendRequest): Promise<ICommonResponse<IEmailSendResponse>> => {
  const { data } = await axiosInstance.post("/api/users/email-send", { email });
  return data;
};

// 이메일 인증 코드 검증
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

// 단순 회원가입
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

// 토큰 재발급
export const reissueToken = async (): Promise<
  ICommonResponse<ITokenRefreshResponse>
> => {
  const { data } = await axiosInstance.post("/api/auth/reissue");
  return data;
};

// 로그인
export const login = async ({
  email,
  password,
}: ILoginRequest): Promise<ICommonResponse<ILoginResponse>> => {
  const { data } = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return data;
};

// SMS 인증 코드 전송
export const sendSMS = async ({
  phoneNumber,
}: ISmsSendRequest): Promise<ICommonResponse<ISmsSendResponse>> => {
  const { data } = await axiosInstance.post("/api/users/sms-send", {
    phoneNumber,
  });
  return data;
};

// SMS 인증 코드 검증
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

// 비밀번호 재설정 요청
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

// 비밀번호 재설정
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
