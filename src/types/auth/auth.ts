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
