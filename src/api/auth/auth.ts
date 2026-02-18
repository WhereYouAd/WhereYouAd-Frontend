import type {
  IEmailSendRequest,
  IEmailSendResponse,
  IEmailVerifyRequest,
  ILoginRequest,
  ILoginResponse,
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
export const signUp = async (
  data: ISignUpRequest,
): Promise<ICommonResponse<ISignUpResponse>> => {
  const { data: responseData } = await axiosInstance.post(
    "/api/users/signup",
    data,
  );
  return responseData;
};

// 토큰 재발급
export const reissueToken = async (): Promise<
  ICommonResponse<ITokenRefreshResponse>
> => {
  const { data } = await axiosInstance.post("/api/auth/reissue");
  return data;
};

// 로그인
export const login = async (
  data: ILoginRequest,
): Promise<ICommonResponse<ILoginResponse>> => {
  const { data: responseData } = await axiosInstance.post(
    "/api/auth/login",
    data,
  );

  return responseData;
};

// SMS 인증 코드 전송
export const sendSMS = async (
  data: ISmsSendRequest,
): Promise<ICommonResponse<ISmsSendResponse>> => {
  const { data: responseData } = await axiosInstance.post(
    "/api/users/sms-send",
    data,
  );
  return responseData;
};

// SMS 인증 코드 검증
export const verifySMS = async (
  data: ISmsVerifyRequest,
): Promise<ICommonResponse<ISmsVerifyResponse>> => {
  const { data: responseData } = await axiosInstance.post(
    "/api/users/sms-verify",
    data,
  );
  return responseData;
};
