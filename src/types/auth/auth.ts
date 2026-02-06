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
