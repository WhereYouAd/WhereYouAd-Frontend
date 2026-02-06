// 이메일 인증 코드 전송 요청 타입
export interface IEmailSendRequest {
  email: string;
}

// 이메일 인증 코드 전송 응답 타입
export interface IEmailSendResponse {
  message: string;
  email: string;
  expireIn: number;
}

// 이메일 인증 코드 확인 요청 타입
export interface IEmailVerifyRequest {
  email: string;
  authCode: string;
}

// 회원가입 요청 타입
export interface ISignUpRequest {
  email: string;
  password: string;
  name: string;
  phone_number: string;
}

// 회원가입 응답 타입
export interface ISignUpResponse {
  userId: number;
  createdAt: string;
}

// 로그인 요청 타입
export interface ILoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface ILoginResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

// 토큰 재발급 요청 타입
export interface ITokenRefreshRequest {
  refreshToken: string;
}

// 토큰 재발급 응답 타입
export interface ITokenRefreshResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}
