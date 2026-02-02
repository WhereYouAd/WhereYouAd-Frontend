import type { ICommonResponse } from "@/types/common/common";

import type {
  IEmailSendRequest,
  IEmailSendResponse,
  IEmailVerifyRequest,
} from "../../types/auth/auth";

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
