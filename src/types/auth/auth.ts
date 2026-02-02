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
