export interface IEmailSendRequest {
  email: string;
}

export interface IEmailSendResponse {
  message: string;
  email: string;
  expireIn: number;
}

export interface IEmailVerifyRequest {
  email: string;
  authCode: string;
}

export interface ISignUpRequest {
  email: string;
  password: string;
  name: string;
  phone_number: string;
}

export interface ISignUpResponse {
  userId: number;
  createdAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

export interface ITokenRefreshResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

// 소셜 로그인 OAuth2 경로용
export type TSocialLoginPlatform = "kakao" | "naver" | "google";

// 서버 응답의 로그인 provider
export type TLoginProvider = "EMAIL" | "KAKAO" | "NAVER" | "GOOGLE";

export interface ISmsSendRequest {
  phoneNumber: string;
}

export interface ISmsSendResponse {
  message: string;
  phoneNumber: string;
  expireIn: number;
}

export interface ISmsVerifyRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface ISmsVerifyResponse {
  isVerified: boolean;
  verificationMessage: string;
  email: string;
}

export interface IPasswordResetRequest {
  email: string;
  password: string;
}

export interface IMyPageInfoResponse {
  userId: number;
  email: string;
  name: string;
  profileImageUrl: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  providerType: TLoginProvider;
}
