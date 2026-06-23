export interface INaverCredentialsRequest {
  customerId: string;
  apiKey: string;
  secretKey: string;
}

/** POST 성공 응답 — 프론트에서 참조하는 최소 필드만 (secretKey 제외) */
export interface INaverConnectResponseData {
  customerId: string;
}
