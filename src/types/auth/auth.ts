// 이메일 인증 전송 요청
export interface IEmailSendRequest {
  email: string;
}

// 이메일 인증 전송 응답
export interface IEmailSendResponse {
  message: string;
  email: string;
  expireIn: number;
}

// 이메일 인증 확인 요청
export interface IEmailVerifyRequest {
  email: string;
  authCode: string;
}

// 회원가입 요청
export interface ISignUpRequest {
  email: string;
  password: string;
  name: string;
  phone_number: string;
}

// 회원가입 응답
export interface ISignUpResponse {
  userId: number;
  createdAt: string;
}

// 로그인 요청
export interface ILoginRequest {
  email: string;
  password: string;
}
export type TLoginFormValues = ILoginRequest;

// 로그인 응답
export interface ILoginResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

// 토큰 재발급 요청
export interface ITokenRefreshRequest {
  refreshToken: string;
}

// 토큰 재발급 응답
export interface ITokenRefreshResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

// 소셜 로그인 플랫폼
export type TSocialLoginPlatform = "kakao" | "naver" | "google";

// SMS 인증 요청
export interface ISmsSendRequest {
  phoneNumber: string;
}

// SMS 인증 요청 응답
export interface ISmsSendResponse {
  message: string;
  phoneNumber: string;
  expireIn: number;
}

// SMS 인증 확인 요청
export interface ISmsVerifyRequest {
  phoneNumber: string;
  verificationCode: string;
}

// SMS 인증 확인 응답
export interface ISmsVerifyResponse {
  isVerified: boolean;
  verificationMessage: string;
  email: string;
}

// 비밀번호 재설정 요청
export interface IPasswordResetRequest {
  email: string;
  password: string;
}
